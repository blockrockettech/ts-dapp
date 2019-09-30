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
            <p>No bids have been received yet...</p>
        </div>
    </div>
</template>

<script lang="ts">
    import moment from 'moment';
    import { mapGetters } from 'vuex';
    import { Component, Prop, Watch, Vue } from 'vue-property-decorator';

    import { getEventsByName, etherFromWei } from '@/utils/drizzle/drizzle-utils';

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