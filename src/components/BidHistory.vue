<template>
    <div class="bid-history-container my-6">
        <h3 class="mb-4 text-center">
            Bid History
        </h3>
        <div v-if="anyBidReceived">
            <div class="highest-bid-container mb-5 text-center text-lg-left">
                <div class="small text-center pb-2 border-bottom">
                    <span>Highest Bid</span>
                </div>
                <div class="my-2 text-center text-success text-large"
                     v-if="highestBidData.address === activeAccount">
                    You made the highest offer!
                </div>
                <div class="highest-bid-row text-center my-2">
                    <span>{{highestBidData.elapsedTime}}</span><br/>
                    <span>{{highestBidData.address}}</span><br/>
                    <span>{{highestBidData.amount}} ETH</span><br/>
                </div>
            </div>
            <div class="previouse-bids text-center text-lg-left " v-if="previousBids.length !== 0">
                <div class="small text-center pb-2 border-bottom">
                    <span>Previous Bids</span>
                </div>
                <div class="row my-2 small" v-for="previousBid in previousBids">
                    <span class="col-12 col-lg-3">{{previousBid.elapsedTime}}</span>
                    <span class="col-12 col-lg-6 text-lg-center">{{previousBid.address}}</span>
                    <span class="col-12 col-lg-3 text-lg-right">{{previousBid.amount}} ETH</span>
                </div>
            </div>
        </div>
        <div v-else>
            <p class="text-center">No bids have been received yet... Be the first to bid!</p>
        </div>
    </div>
</template>

<script lang="ts">
    import moment from 'moment';
    import { mapGetters } from 'vuex';
    import { Component, Prop, Watch, Vue } from 'vue-property-decorator';

    import { getEventsByName, etherFromWei } from '@blockrocket/vue-drizzle-utils';

    @Component({
        computed: {
            ...mapGetters('accounts', ['activeAccount', 'activeBalance']),
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
        activeAccount!: string;

        humanisedTimeFromUnixTimestamp(timestamp: number) {
            const now = moment().utc(false);
            const _timestamp = moment.unix(timestamp).utc(false);
            const duration = moment.duration(now.diff(_timestamp));
            return duration.humanize() + ' ago';
        }

        get events() {
            if (this.isDrizzleInitialized) {
                const currentRound = this.currentRound;
                return getEventsByName(this.contractInstances, this.contractName, 'BidAccepted')
                    .filter((event: any) => {
                        return event.returnValues._round === currentRound;
                    }).reverse();
            }
            return [];
        }

        get anyBidReceived() {
            return this.events.length > 0;
        }

        get highestBidData(): any {
            if (this.events.length > 0) {
                const bidEvent = this.events[0];
                const highestBid = etherFromWei(this.drizzleInstance, bidEvent.returnValues._amount);

                this.$store.dispatch('updateHighestBidInEth', Number(highestBid));
                this.$store.dispatch('updateParamFromHighestBidder', Number(bidEvent.returnValues._param));

                return {
                    elapsedTime: this.humanisedTimeFromUnixTimestamp(bidEvent.returnValues._timeStamp),
                    address: bidEvent.returnValues._bidder,
                    amount: highestBid
                };
            }

            return {
                elapsedTime: 'Loading...',
                address: 'Loading...',
                amount: 'Loading...'
            };
        }

        get previousBids(): any[] {
            return this.events.map((event: any) => {
                return {
                    elapsedTime: this.humanisedTimeFromUnixTimestamp(event.returnValues._timeStamp),
                    address: event.returnValues._bidder,
                    amount: etherFromWei(this.drizzleInstance, event.returnValues._amount)
                };
            });
        }

        @Watch('events')
        onNewEvents(newValue: any[], oldValue: any[]) {
            if ((newValue.length - oldValue.length) === 1 && oldValue.length !== 0) {
                const event = newValue[0];
                const msg: string =
                    `${etherFromWei(this.drizzleInstance, event.returnValues._amount)} ETH bid accepted from ${event.returnValues._bidder}`;
                this.$toasted.show(msg, {
                    action : {
                        text : 'Close',
                        onClick : (e, toastObject) => {
                            toastObject.goAway(0);
                        }
                    },
                    duration: 15000
                });
            }
        }
    }
</script>

<style scoped>
    .bid-history-container {
        padding-left: 15px;
    }

    .highest-bid-container {
    }

    .highest-bid-row {
    }
</style>
