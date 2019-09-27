<template>
    <div class="previous-auction-container">
        <div class="header-container">
            <span class="round-counter">
                #{{roundNo}} / {{totalRounds}}
            </span>
            <span class="header">
                Passed Auction
            </span>
        </div>
        <div class="content-container">
            <div class="img-container">
                <img :src="paramImgUrl" alt=""/>
            </div>
            <div class="details-container">
                <div class="details-container-row">
                    <span class="row-label">ENDED</span>
                    <br/>
                    <span class="row-value">
                        {{roundEndDay}}
                        <br/>
                        {{roundEndTime}}
                    </span>
                </div>
                <div class="details-container-row">
                    <span class="row-label">OWNER</span>
                    <br/>
                    <span class="row-value">
                        {{highestBidder}}
                    </span>
                </div>
                <div class="details-container-row">
                    <span class="row-label">BID</span>
                    <br/>
                    <span class="row-value">
                        {{highestBid}} ETH
                    </span>
                </div>
                <div class="details-container-row">
                    <a :href="etherscanTokenUrl">→ view token on etherscan</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Moment } from 'moment';
    import moment from 'moment';
    import { mapGetters } from 'vuex';
    import { Component, Prop, Watch, Vue } from 'vue-property-decorator';

    @Component({
        computed: {
            ...mapGetters('drizzle', ['drizzleInstance', 'isDrizzleInitialized']),
            ...mapGetters('contracts', ['getContractData', 'contractInstances']),
            ...mapGetters(['contractName', 'tokenContractAddress', 'roundEnd']),
        }
    })
    export default class PreviousAuction extends Vue {
        @Prop({ required: true })
        roundNo!: number;

        @Prop({ required: true })
        totalRounds!: number;

        @Prop({ required: true })
        auctionStartTime!: number;

        @Prop({ required: true })
        roundLengthInSeconds!: number;

        roundEnd!: (round: number, auctionStartTime: number, roundLengthInSeconds: number) => Moment;
        isDrizzleInitialized!: boolean;
        contractName!: string;
        tokenContractAddress!: string;
        drizzleInstance: any;
        getContractData: any;
        contractInstances: any;

        etherFromWei(wei: string): number {
            if (this.isDrizzleInitialized && wei !== 'loading') {
                const utils = this.drizzleInstance.web3.utils;
                return utils.fromWei(wei, 'ether');
            }

            return 0;
        }

        get events() {
            if (this.isDrizzleInitialized) {
                const currentRound = this.roundNo;
                const allEvents = (this.contractInstances[this.contractName].events || []);
                return allEvents.filter((event: any) => {
                    return event.event === 'RoundFinalised';
                }).filter((event: any, index: number, self: any) => {
                    return index == self.findIndex((obj: any) => {
                        return JSON.stringify(obj) === JSON.stringify(event);
                    });
                }).filter((event: any) => {
                    return event.returnValues._round === currentRound.toString();
                }).reverse();
            }
            return [];
        }

        get roundEndDay() {
            if (this.events.length === 1) {
                const event = this.events[0];
                return moment.unix(event.returnValues._timestamp).utc(false).format('DD MMMM YYYY');
            }
            return 'loading...';
        }

        get roundEndTime() {
            if (this.events.length === 1) {
                const event = this.events[0];
                return moment.unix(event.returnValues._timestamp).utc(false).format('hh:mma');
            }
            return 'loading...';
        }

        get highestBidder() {
            if(this.events.length === 1) {
                return this.events[0].returnValues._highestBidder;
            }

            return 'loading...';
        }

        get highestBid() {
            if(this.events.length === 1) {
                return this.etherFromWei(this.events[0].returnValues._highestBid);
            }

            return 'loading...';
        }

        get paramImgUrl() {
            if (this.events.length === 1) {
                const event = this.events[0];
                return `https://robohash.org/${event.returnValues._param}/image`;
            }
            return '';
        }

        get etherscanTokenUrl() {
            //todo: fix network using drizzle utils package
            return `https://ropsten.etherscan.io/token/${this.tokenContractAddress}?a=${this.roundNo}`;
        }
    }
</script>

<style scoped>
    .previous-auction-container {
        margin-top: 9rem;
    }

    .header-container {
        border-top: 1px solid #343a40;
        margin-bottom: 3rem;
    }

    .content-container {
        text-align: center;
    }

    .round-counter {
        font-size: 4.5rem;
        font-weight: 400;
        line-height: 1.25;
    }

    .header {
        position: absolute;
        right: 0;
        font-size: 2.5rem;
        font-weight: 500;
        line-height: 1.25;
    }

    .details-container {
        margin: 3rem 0;
    }

    .details-container-row {
        margin-bottom: 1rem;
    }

    .row-label {
        text-transform: uppercase;
        letter-spacing: .2em;
        font-size: 80%;
        font-weight: 500;
    }

    .row-value {
        font-size: 1.25rem;
        font-weight: 600;
    }
</style>