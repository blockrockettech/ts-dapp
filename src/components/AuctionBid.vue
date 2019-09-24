<template>
    <div class="auction-bid-container">
        <!--<h1>Auction bid</h1>
        <hr/>
        <h2>Contract</h2>
        <div v-if="isDrizzleInitialized">
            <drizzle-contract
                    contractName="TwistedAuctionMock"
                    method="currentRound"
                    label="Current Round"
            />
            <drizzle-contract
                    contractName="TwistedAuctionMock"
                    method="highestBidFromRound"
                    label="Highest bid"
                    :methodArgs="roundArgs"
            />
            <div><strong>Highest bid:</strong> {{ highestBidInETH }} <strong>(ETH)</strong> </div>
            <drizzle-contract
                    contractName="TwistedAuctionMock"
                    method="highestBidderFromRound"
                    label="Highest bidder"
                    :methodArgs="roundArgs"
            />
            <drizzle-contract
                    contractName="TwistedAuctionMock"
                    method="winningRoundParameter"
                    label="Current Parameter"
                    :methodArgs="roundArgs"
            />
        </div>
        <div v-else>Loading...</div>
        <br/>
        <hr/>
        <ContractFormV2
                contractName="TwistedAuctionMock"
                method="bid"
                :placeholders="['Geo Parameter']"
                :value="bidInWei"
        />
        <div>
            <label for="bid-amount-input">
                Bid amount (ETH):
                <input id="bid-amount-input" type="number" v-model="bid"/>
            </label>
        </div>
        <p>
            Current bid in Wei: {{ bidInWei }}
        </p>-->
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
                        <b-button variant="outline-info" class="adjust-btn-width" @click="decreaseBid()">-</b-button>
                        <b-button variant="outline-info" class="adjust-btn-width" @click="increaseBid()">+</b-button>
                    </b-input-group-prepend>

                    <b-form-input type="number" min="0.01" v-model="bid"></b-form-input>

                    <b-input-group-append>
                        <b-button variant="success">BID</b-button>
                    </b-input-group-append>
                </b-input-group>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { mapGetters } from 'vuex';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import ContractFormV2 from './ContractFormV2.vue';

    @Component({
        computed: {
            ...mapGetters('drizzle', ['drizzleInstance', 'isDrizzleInitialized']),
            ...mapGetters('contracts', ['getContractData', 'contractInstances'])
        },
        components: {ContractFormV2}
    })
    export default class AuctionBid extends Vue {
        @Prop({ required: true })
        currentRound!: number;

        @Prop({ required: true })
        auctionContractName!: string;

        parameter: number = 0;

        minBid: number = 0.01;
        bid: number = this.minBid;

        drizzleInstance: any;
        isDrizzleInitialized!: boolean;
        getContractData: any;

        decreaseBid() {
            this.bid -= 0.005;
            if(this.bid < this.minBid) {
                this.bid = this.minBid;
            }
        }

        increaseBid() {
            this.bid += 0.005;
        }

        get bidInWei(): number {
            if(this.isDrizzleInitialized) {
                const utils = this.drizzleInstance.web3.utils;
                const bid: string = this.bid.toString();
                return bid !== '' ? utils.toWei(this.bid.toString(), 'ether') : -1;
            }
            return -1;
        }

        get highestBidInETH(): number {
            if(this.isDrizzleInitialized) {
                const arg = {
                    contract: this.auctionContractName,
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
</style>
