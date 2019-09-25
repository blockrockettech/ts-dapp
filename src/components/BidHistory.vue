<template>
    <div class="bid-history-container">
        <h3 class="mb-3">
            BID HISTORY
        </h3>
        <div v-if="anyBidReceived">
            <div class="highest-bid-container">
                <div class="header">
                    <span>Highest Bid</span>
                </div>
                <div class="highest-bid-row row">
                    <span class="col">{{highestBidData.elapsedTime}}</span>
                    <span class="col-6">{{highestBidData.address}}</span>
                    <span class="col">{{highestBidData.amount}} ETH</span>
                </div>
            </div>
            <div v-if="previousBids.length !== 0">
                <div class="header">
                    <span>Previous Bids</span>
                </div>
                <div class="row" v-for="previousBid in previousBids">
                    <span class="col">{{previousBid.elapsedTime}}</span>
                    <span class="col-6">{{previousBid.address}}</span>
                    <span class="col">{{previousBid.amount}} ETH</span>
                </div>
            </div>
        </div>
        <div v-else>
            <!--<p>No bids have been received yet...</p>-->
            <p v-for="event in events">{{event.event}}</p>
        </div>
    </div>
</template>

<script lang="ts">
    import { mapGetters } from 'vuex';
    import { Component, Prop, Watch, Vue } from 'vue-property-decorator';

    @Component({
        computed: {
            ...mapGetters('drizzle', ['drizzleInstance', 'isDrizzleInitialized']),
            ...mapGetters('contracts', ['getContractData', 'contractInstances']),
            ...mapGetters(['contractName'])
        }
    })
    export default class BidHistory extends Vue {
        @Prop({ required: true })
        currentRound!: number;

        drizzleInstance: any;
        isDrizzleInitialized!: boolean;
        getContractData: any;
        contractInstances: any;
        contractName!: string;

        get events() {
            if (this.isDrizzleInitialized) {
                const events = this.contractInstances[this.contractName].events || [];
                return events.reverse();
            }
            return [];
        }

        get anyBidReceived() {
            return this.events.filter((el: any) => {
                return el.event === 'BidAccepted'
            }).length > 0;
        }

        get highestBidData(): any {
            if (this.events.length > 0) {
                return {
                    elapsedTime: 'Loading...',
                    address: 'Loading...',
                    amount: 'Loading...'
                };
            }

            return {
                elapsedTime: 'Loading...',
                address: 'Loading...',
                amount: 'Loading...'
            };
        }

        get previousBids(): any[] {
            const utils = this.drizzleInstance.web3.utils;
            return this.events.map((el: any) => {
                return {
                    elapsedTime: 'TODO',
                    address: el.returnValues._bidder,
                    amount: utils.fromWei(el.returnValues._amount, 'ether')
                };
            });
        }
    }
</script>

<style scoped>
    .bid-history-container {
        margin-top: 6rem;
        padding-left: 15px;
    }

    .header {
        font-size: 80%;
        font-weight: 500;
        border-bottom: 1px solid #dee2e6;
    }

    .highest-bid-container {
        margin-bottom: 1.5rem;
    }

    .highest-bid-row {
        color: green;
    }
</style>