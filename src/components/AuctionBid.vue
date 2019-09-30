<template>
    <div class="auction-bid-container">
        <div class="img-container">
            <img :src="paramImgUrl" alt=""/>
        </div>
        <div class="slider-container">
            <label class="slider-label" for="slider-input">
                Adjust the settings to your slider
            </label>
            <b-form-input id="slider-input"
                          class="slider-input"
                          type="range"
                          min="0"
                          max="63"
                          @change="inputReceived"
                          v-model="parameter" />
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

                    <b-form-input type="number"
                                  :min="minBid"
                                  step="0.02"
                                  v-model="bid"
                                  @change="inputReceived"
                                  class="bid-input" />

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
    import { Component, Watch, Vue } from 'vue-property-decorator';

    import { etherFromWei, weiFromEther, addWeiToEther } from '@/utils/drizzle/drizzle-utils';

    const DEFAULT_MIN_BID: number = 0.01;
    const DEFAULT_MIN_INCREMENT_IN_WEI: number = 20000000000000000;

    @Component({
        computed: {
            ...mapGetters('drizzle', ['drizzleInstance', 'isDrizzleInitialized']),
            ...mapGetters('contracts', ['getContractData']),
            ...mapGetters(['contractName', 'highestBidInEth', 'paramFromHighestBidder'])
        }
    })
    export default class AuctionBid extends Vue {
        // State
        parameter: number = 0;
        bid: number = 0.01;
        receivedInput: boolean = false;

        // Custom mapped getters
        contractName!: string;
        highestBidInEth!: number;
        paramFromHighestBidder!: number;

        // Drizzle mapped getters
        drizzleInstance: any;
        isDrizzleInitialized!: boolean;
        getContractData: any;

        // -----------------
        // Component Methods
        // -----------------

        inputReceived() {
            this.receivedInput = true;
        }

        submitBid() {
            if(this.isDrizzleInitialized) {
                const bidContractMethod = this.drizzleInstance.contracts[this.contractName].methods['bid'];
                bidContractMethod.cacheSend(this.parameter, { value: this.bidInWei });
            } else {
                alert("Drizzle doesn't seem to be initialised / ready");
            }
        }

        // -----------------
        // Computed Props
        // -----------------

        get paramForImg() {
            if (!this.receivedInput && this.parameter !== this.paramFromHighestBidder) {
                this.parameter = this.paramFromHighestBidder;
            }

            return this.parameter;
        }

        get paramImgUrl() {
            return `https://robohash.org/${this.paramForImg}/image`;
        }

        get minBid(): number {
            if (this.isDrizzleInitialized) {
                const min = this.getContractData({
                    contract: this.contractName,
                    method: 'minBid'
                });

                let minInEther: number = etherFromWei(this.drizzleInstance, min, DEFAULT_MIN_BID);

                if (this.highestBidInEth > minInEther) {
                    minInEther = addWeiToEther(
                        this.drizzleInstance,
                        DEFAULT_MIN_INCREMENT_IN_WEI.toString(),
                        this.highestBidInEth.toString()
                    );

                    minInEther = Number(Number(minInEther).toFixed(6));

                    if (!this.receivedInput) {
                        this.bid = minInEther;
                    }
                }

                return minInEther;
            }

            return DEFAULT_MIN_BID;
        }

        get bidInWei(): number {
            return weiFromEther(this.drizzleInstance, this.bid.toString());
        }

        // -----------------
        // Watched Props
        // -----------------

        @Watch('bid')
        onBidChanged(newVal: number) {
            this.bid = Number(Number(newVal).toFixed(6));
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
