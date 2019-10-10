<template>
    <div class="previous-auction-container container my-6 border-top border-dark">
        <div class="row my-3">
            <span class="current-round-counter col-12 col-md-6 display-4">
                #{{roundNo}} / {{totalRounds}}
            </span>
            <span class="col-12 col-md-6 text-md-right">
                Passed Auction
            </span>
        </div>
        <div class="mt-5">
            <div class="img-container mb-5">
                <img :src="paramImgUrl" alt="" class="d-block w-auto h-auto mx-auto"/>
            </div>
            <div class="details-container text-center">
                <div class="mb-3">
                    <span class="small">ENDED</span>
                    <br/>
                    <span class="text-large">
                        {{roundEndDay}}
                        <br/>
                        {{roundEndTime}}
                    </span>
                </div>
                <div class="mb-3">
                    <span class="small">OWNER</span>
                    <br/>
                    <span class="text-large">
                        {{highestBidder}}
                    </span>
                </div>
                <div class="mb-4">
                    <span class="small">BID</span>
                    <br/>
                    <span class="text-large">
                        {{highestBid}} ETH
                    </span>
                </div>
                <div class="small">
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

    import { getEtherscanBaseUrl, getEventsByName, etherFromWei } from '@blockrocket/vue-drizzle-utils';

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
        tokenContractAddress: any;
        drizzleInstance: any;
        getContractData: any;
        contractInstances: any;

        get events() {
            if (this.isDrizzleInitialized) {
                const currentRound = this.roundNo;
                return getEventsByName(this.contractInstances, this.contractName, 'RoundFinalised')
                    .filter((event: any) => {
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
                return etherFromWei(this.drizzleInstance, this.events[0].returnValues._highestBid);
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
            if(this.isDrizzleInitialized) {
                const tokenAddress = this.tokenContractAddress(this.drizzleInstance);
                return `${getEtherscanBaseUrl(this.drizzleInstance)}/token/${tokenAddress}?a=${this.roundNo}`;
            }
            return '';
        }
    }
</script>

<style scoped>
    
</style>