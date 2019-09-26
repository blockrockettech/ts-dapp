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

        etherFromWei(wei: string): number {
            if (this.isDrizzleInitialized && wei !== 'loading') {
                const utils = this.drizzleInstance.web3.utils;
                return utils.fromWei(wei, 'ether');
            }

            return 0;
        }

        get events() {
            if (this.isDrizzleInitialized) {
                const currentRound = this.currentRound;
                const allEvents = (this.contractInstances[this.contractName].events || []);
                return allEvents.filter((event: any) => {
                   return event.event === 'BidAccepted';
                }).filter((event: any, index: number, self: any) => {
                    return index == self.findIndex((obj: any) => {
                        return JSON.stringify(obj) === JSON.stringify(event);
                    });
                }).filter((event: any) => {
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
                const event = this.events[0];
                return {
                    elapsedTime: this.humanisedTimeFromUnixTimestamp(event.returnValues._timeStamp),
                    address: event.returnValues._bidder,
                    amount: this.etherFromWei(event.returnValues._amount)
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
                    amount: this.etherFromWei(event.returnValues._amount)
                };
            });
        }

        @Watch('events')
        onNewEvents(newValue: any[], oldValue: any[]) {
            if ((newValue.length - oldValue.length) === 1 && oldValue.length !== 0) {
                const event = newValue[0];
                const msg: string =
                    `${this.etherFromWei(event.returnValues._amount)} ETH bid accepted from ${event.returnValues._bidder}`;
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