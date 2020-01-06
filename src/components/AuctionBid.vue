<template>
    <div class="auction-bid-container">
    		<div class="range-img-container">
	        <div class="img-container">
	            <img v-for="n in 64" class="param-img" :src="constructImgUrl(n)" alt="" v-bind:class="[ paramImgUrl === constructImgUrl(n) ? 'active' : '' ]"/>
	        </div>
	      </div>
        <div class="slider-container my-5 mx-auto">
            <label class="slider-label" for="slider-input">
                <span><small>Step 1:</small></span><br/>
                <span class="text-large">Adjust the setting on the slider:</span>
            </label>
            <div class="row">
                <div class="col-12">
                    <b-form-input id="slider-input"
                                  class="slider-input"
                                  type="range"
                                  min="1"
                                  max="64"
                                  value="1"
                                  @change="inputReceived"
                                  v-model="bidParameter"/>
                </div>
                <div class="col-12 text-center">
                    <span class="slider-value">{{ bidParameter }}</span>
                </div>
            </div>
        </div>
        <div class="make-bid-container my-5 mx-auto">
            <span class="make-bid-label">
                <span><small>Step 2:</small></span><br/>
                <span class="text-large">Make your bid:</span>
            </span>
            <div class="make-bid-input-group-container">
                <b-input-group>
                    <b-form-input type="number"
                                  :min="minBid"
                                  step="0.02"
                                  v-model="bid"
                                  @change="inputReceived"
                                  class="bid-input" />

                    <b-input-group-append>
                        <b-button variant="dark" @click="submitBid">→ BID</b-button>
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

    import {utils} from 'ethers';

    const DEFAULT_MIN_BID = "0.02";
    const DEFAULT_MIN_INCREMENT_IN_WEI: number = 20000000000000000;

    @Component({
        computed: {
            ...mapGetters(['auctionData', 'contracts'])
        }
    })
    export default class AuctionBid extends Vue {
        // Props
        @Prop({ required: true })
        currentRound!: number;

        // State
        bidParameter = "1";
        bid = DEFAULT_MIN_BID;
        receivedInput: boolean = false;

        // Custom mapped getters
        auctionData: any;
        contracts: any;


        // -----------------
        // Component Methods
        // -----------------

        inputReceived() {
            this.receivedInput = true;
        }

        async submitBid() {
            const {TwistedSisterAuction} = this.contracts;
            const tx = await TwistedSisterAuction.bid(
                utils.bigNumberify(this.bidParameter),
                {
                    value: this.bidInWei,
                    gasLimit: 100000,
                    gasPrice: utils.parseUnits('9.0', 'gwei'),
                }
            );

            let receipt = await tx.wait(1);
            console.log(`Rec: `, receipt);
        }

        // -----------------
        // Computed Props
        // -----------------

        get paramForImg() {
            const paramFromHighestBidder = this.auctionData.currentRound.paramFromHighestBidder;
            if (!this.receivedInput && paramFromHighestBidder && paramFromHighestBidder.toString() !== '0'
                && this.bidParameter !== paramFromHighestBidder.toString()) {
                this.bidParameter = paramFromHighestBidder.toString();
            }

            return this.bidParameter.toString();
        }

        get paramImgUrl() {
            return this.constructImgUrl( Number(this.paramForImg) );
        }

       	constructImgUrl( _param: number ) {
            const currentDayLetter = String.fromCharCode(64 + Number(this.currentRound));
            const paramForImgStr = (Number(_param)-1).toString();
            const paramForImgLength = paramForImgStr.length;
            let paddedParam = '';
            for (let i = 0; i < 4 - paramForImgLength; i += 1) {
                paddedParam += '0';
            }
            paddedParam += paramForImgStr;
            const fileName = currentDayLetter + paddedParam + '.png';
            return `/images/${currentDayLetter}/${fileName}`;
        }

        get minBid() {
            if (this.auctionData.minBid && this.auctionData.currentRound.highestBidInEth) {
                let minInEther: string = utils.formatEther(this.auctionData.minBid);
                const highestBidInEth = this.auctionData.currentRound.highestBidInEth;

                if (highestBidInEth && Number(highestBidInEth) > Number(minInEther)) {
                    const defaultIncrement = utils.bigNumberify(DEFAULT_MIN_INCREMENT_IN_WEI.toString());
                    const newMinAsBN = defaultIncrement.add(utils.parseEther(highestBidInEth.toString()));
                    minInEther = utils.formatEther(newMinAsBN.toString());

                    if (!this.receivedInput) {
                        this.bid = minInEther;
                    }
                }

                return minInEther;
            }

            return DEFAULT_MIN_BID;
        }

        get bidInWei() {
            return utils.parseEther(this.bid.toString());
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

		.range-img-container{
			padding: 0 1.5rem;
			width: 100%;
			max-width: 600px;
			margin-left: auto;
			margin-right: auto;
		}

    .img-container{
      width: 100%;
      padding-top: 100%;
      position: relative;
      position: relative;
    }

    .param-img{
    	position: absolute;
      top:0;
      left:0;
      width: 100%;
      height: 100%;
      display: block;
      opacity: 0;
      display: none;
    }

    .param-img.active{
    	display: block;
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
        padding: 15px;
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

    .custom-range::-webkit-slider-thumb {
        height: 16px;
        width: 16px;
    }

    .custom-range::-moz-range-thumb {
        height: 16px;
        width: 16px;
    }

    .custom-range::-ms-thumb {
        height: 16px;
        width: 16px;
    }
</style>
