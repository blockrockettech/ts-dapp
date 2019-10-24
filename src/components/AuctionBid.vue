<template>
    <div class="auction-bid-container">
        <div class="img-container mx-auto">
            <!--<div class="param-image position-absolute" v-for="n in 64" >
                <img class="img-container" :src="paramImgUrl" alt="" v-bind:class="[ parameter == (n-1) ? 'active' : 'notactive', 'bg-light' ]"/>
            </div>-->
            <img class="img-container" :src="paramImgUrl" alt="" />
        </div>
        <div class="slider-container my-5 mx-auto">
            <label class="slider-label" for="slider-input">
                <span><small>Step 1:</small></span><br/>
                <span class="text-large">Adjust the settings to your slider:</span>
            </label>
            <div class="row">
                <div class="col-9">
                    <b-form-input id="slider-input"
                                  class="slider-input"
                                  type="range"
                                  min="1"
                                  max="64"
                                  value=""
                                  @change="inputReceived"
                                  v-model="bidParameter"/>
                </div>
                <div class="col-3">
                    <span class="slider-value">{{ bidParameter }}</span>
                </div>
            </div>

            <span class="reset-label">
                + RESET TO HIGHEST BID
            </span>

        </div>
        <div class="make-bid-container my-5 mx-auto">
            <span class="make-bid-label">
                <span><small>Step 2:</small></span><br/>
                <span class="text-large">Make your bid:</span>
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
                        <b-button variant="success" @click="submitBid">→ BID</b-button>
                    </b-input-group-append>
                </b-input-group>
            </div>
            <span v-bind:class="{ 'error-txt': bid < minBid }">
                <small>Min bid: {{minBid}} ETH</small>
            </span>
        </div>
    </div>
</template>

<script lang="ts">
    import { mapGetters } from 'vuex';
    import {Component, Watch, Vue, Prop} from 'vue-property-decorator';

    import { etherFromWei, weiFromEther, addWeiToEther } from '@blockrocket/vue-drizzle-utils';

    const DEFAULT_MIN_BID: number = 0.02;
    const DEFAULT_MIN_INCREMENT_IN_WEI: number = 20000000000000000;

    @Component({
        computed: {
            ...mapGetters('drizzle', ['drizzleInstance', 'isDrizzleInitialized']),
            ...mapGetters('contracts', ['getContractData']),
            ...mapGetters(['contractName', 'highestBidInEth', 'paramFromHighestBidder'])
        }
    })
    export default class AuctionBid extends Vue {
        // Props
        @Prop({ required: true })
        currentRound!: number;

        // State
        bidParameter: number = 1;
        bid: number = DEFAULT_MIN_BID;
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
                bidContractMethod.cacheSend(this.bidParameter, { value: this.bidInWei });
            } else {
                alert("Drizzle doesn't seem to be initialised / ready");
            }
        }

        // -----------------
        // Computed Props
        // -----------------

        get paramForImg() {
            if (!this.receivedInput && this.bidParameter !== this.paramFromHighestBidder) {
                this.bidParameter = this.paramFromHighestBidder;
            }

            return this.bidParameter;
        }

        get paramImgUrl() {
            const currentDayLetter = String.fromCharCode(64 + Number(this.currentRound));
            const paramForImgStr = (Number(this.paramForImg)-1).toString();
            const paramForImgLength = paramForImgStr.length;
            let paddedParam = '';
            for (let i = 0; i < 4 - paramForImgLength; i += 1) {
                paddedParam += '0';
            }
            paddedParam += paramForImgStr;
            const fileName = currentDayLetter + paddedParam + '.png';
            return `/images/${currentDayLetter}/${fileName}`;
        }

        get minBid(): number {
            if (this.isDrizzleInitialized) {
                const min = this.getContractData({
                    contract: this.contractName,
                    method: 'minBid'
                });

                let minInEther: number = etherFromWei(this.drizzleInstance, min, DEFAULT_MIN_BID);

                if (this.highestBidInEth >= minInEther) {
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
    .img-container{
      width: 80%;
    }

    .param-image{
      top:0;
      left:0;
    }

    .param-image img{
      top:0;
      left:0;
      opacity: 0;
    }

    .param-image img.active{
      opacity: 1;
    }

    .auction-bid-container {
        text-align: center;
    }

    .slider-container {
        max-width: 600px;
        width: 100%;
    }

    .slider-label {
    }

    .slider-value {
        font-size: 2rem;
    }

    .slider-input {
        display: block;
        margin: 10px auto;
    }

    .reset-label {
        text-transform: uppercase;
        letter-spacing: .2em;
        font-size: 80%;
        font-weight: 500;
        margin-top: .5rem;
    }

    .make-bid-label {
    }

    .make-bid-container {
        max-width: 600px;
        width: 100%;
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
