<template>
    <div class="auction-bid-container">
        <div class="img-container">
            <img src="http://twistedsister.root-lvl.com/contents/auction-03/03-63.jpg" alt=""/>
        </div>
        <div class="slider-container">
            <label class="slider-label" for="slider-input">
                Adjust the settings to your slider
            </label>
            <b-form-input id="slider-input" type="range" min="0" max="63" v-model="parameter" class="slider-input"></b-form-input>
            <span class="reset-label">
                + RESET TO HIGHEST BID
            </span>
        </div>
        <div class="make-bid-container">
            <span class="make-bid-label">
                Make your bid
            </span>
            <div class="make-bid-input-group-container">
                <b-input-group>
                    <!--<b-input-group-prepend>
                        <b-button variant="outline-info" class="adjust-btn-width" @click="decreaseBid">-</b-button>
                        <b-button variant="outline-info" class="adjust-btn-width" @click="increaseBid">+</b-button>
                    </b-input-group-prepend>-->

                    <b-form-input type="number" :min="minBid" step="0.01" v-model="bid" class="bid-input"></b-form-input>

                    <b-input-group-append>
                        <b-button variant="success" @click="submitBid">BID</b-button>
                    </b-input-group-append>
                </b-input-group>
            </div>
            <span v-bind:class="{ 'error-txt': bid < minBid }">
                Min bid: {{minBid}} ETH
            </span>
        </div>
    </div>
</template>

<script lang="ts">
    import { mapGetters } from 'vuex';
    import { Component, Vue } from 'vue-property-decorator';
    import ContractFormV2 from './ContractFormV2.vue';

    @Component({
        computed: {
            ...mapGetters('drizzle', ['drizzleInstance', 'isDrizzleInitialized']),
            ...mapGetters('contracts', ['getContractData', 'contractInstances']),
            ...mapGetters(['contractName', 'highestBidInEth'])
        },
        components: {ContractFormV2}
    })
    export default class AuctionBid extends Vue {
        parameter: number = 0;

        bid: number = 0.01;
        highestBidInEth!: number;

        drizzleInstance: any;
        isDrizzleInitialized!: boolean;
        getContractData: any;
        contractName!: string;

        submitBid() {
            if(this.isDrizzleInitialized) {
                const bidContractMethod = this.drizzleInstance.contracts[this.contractName].methods['bid'];
                bidContractMethod.cacheSend(this.parameter, { value: this.bidInWei });
            } else {
                alert("Drizzle doesn't seem to be initialised / ready");
            }
        }

        get minBid(): number {
            if (this.highestBidInEth > 0.01) {
                if(this.highestBidInEth > this.bid) {
                    this.bid = this.highestBidInEth;
                }

                return this.highestBidInEth;
            }

            const min = this.getContractData({
               contract: this.contractName,
               method: 'minBid'
            });

            if (min !== 'loading' && this.isDrizzleInitialized) {
                const utils = this.drizzleInstance.web3.utils;
                return Number(utils.fromWei(min, 'ether'));
            }

            return 0.01;
        }

        get bidInWei(): number {
            if(this.isDrizzleInitialized) {
                const utils = this.drizzleInstance.web3.utils;
                const bid: string = this.bid.toString();
                return bid !== '' ? utils.toWei(this.bid.toString(), 'ether') : 0;
            }
            return 0;
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .auction-bid-container {
        text-align: center;
    }

    .slider-container {
        margin: 3rem auto;
    }

    .slider-label {
        font-size: 1.25rem;
        font-weight: 600;
    }

    .slider-input {
        width: 50%;
        display: block;
        margin: 10px auto;
    }

    .reset-label {
        text-transform: uppercase;
        letter-spacing: .2em;
        font-size: 80%;
        font-weight: 500;
    }

    .make-bid-label {
        font-size: 1.25rem;
        font-weight: 600;
    }

    .make-bid-container {
        width: 50%;
        margin: 0 auto;
    }

    .make-bid-input-group-container {
        margin-top: 1rem;
    }

    .error-txt {
        color: red;
    }

    .bid-input {
        text-align: right;
    }
</style>
