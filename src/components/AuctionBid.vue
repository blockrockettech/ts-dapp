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
                    <b-input-group-prepend>
                        <b-button variant="outline-info" class="adjust-btn-width" @click="decreaseBid">-</b-button>
                        <b-button variant="outline-info" class="adjust-btn-width" @click="increaseBid">+</b-button>
                    </b-input-group-prepend>

                    <b-form-input type="number" min="0.01" v-model="bid" class="bid-input"></b-form-input>

                    <b-input-group-append>
                        <b-button variant="success" @click="submitBid">BID</b-button>
                    </b-input-group-append>
                </b-input-group>
            </div>
            <span>
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
            ...mapGetters(['contractName'])
        },
        components: {ContractFormV2}
    })
    export default class AuctionBid extends Vue {
        parameter: number = 0;

        bid: number = 0.01;

        drizzleInstance: any;
        isDrizzleInitialized!: boolean;
        getContractData: any;
        contractName!: string;

        decreaseBid() {
            this.bid -= 0.005;
            if(this.bid < this.minBid) {
                this.bid = this.minBid;
            }
        }

        increaseBid() {
            this.bid += 0.005;
        }

        submitBid() {
            if(this.isDrizzleInitialized) {
                const bidContractMethod = this.drizzleInstance.contracts[this.contractName].methods['bid'];
                bidContractMethod.cacheSend(this.parameter, { value: this.bidInWei });
            } else {
                alert("Drizzle doesn't seem to be initialised / ready");
            }
        }

        get minBid() {
            const min = this.getContractData({
               contract: this.contractName,
               method: 'minBid'
            });

            if (min !== 'loading' && this.isDrizzleInitialized) {
                const utils = this.drizzleInstance.web3.utils;
                return utils.fromWei(min, 'ether');
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

        get highestBidInETH(): number {
            if(this.isDrizzleInitialized) {
                const arg = {
                    contract: this.contractName,
                    method: 'highestBidFromRound'
                };
                const highestBidFromRound: string = this.getContractData(arg);

                if(highestBidFromRound !== 'loading') {
                    const utils = this.drizzleInstance.web3.utils;
                    return utils.fromWei(highestBidFromRound, 'ether');
                } else {
                    return -1;
                }
            }
            return -1;
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

    .adjust-btn-width {
        width: 35px;
    }

    .bid-input {
        text-align: right;
    }
</style>
