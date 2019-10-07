<template>
    <div class="current-auction-container">
        <div class="header-container">
            <span class="current-round-counter">
                #{{currentRound}} / {{totalRounds}}
            </span>
            <span class="header">
                Current Auction
            </span>
        </div>
        <div class="ending-container" v-if="open">
            <span class="ending-label">Ending in:</span>
            <br/>
            <span class="ending-time">{{endingIn}}</span>
        </div>
        <div class="not-started" v-else>
            <span><strong>The current round's bidding window is not open. Attempts to bid will fail!</strong></span>
        </div>

        <AuctionBid :currentRound="currentRound" />
        <BidHistory :currentRound="currentRound" />
    </div>
</template>

<script lang="ts">
    import { mapGetters } from 'vuex';
    import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
    import moment from 'moment';

    import AuctionBid from '@/components/AuctionBid.vue';
    import BidHistory from '@/components/BidHistory.vue';

    @Component({
        components: {AuctionBid, BidHistory},
        computed: {
            ...mapGetters('contracts', ['getContractData']),
            ...mapGetters(['contractName', 'roundStart', 'roundEnd']),
        }
    })
    export default class CurrentAuction extends Vue {
        @Prop({ required: true })
        currentRound!: number;

        @Prop({ required: true })
        auctionStartTime!: number;

        @Prop({ required: true })
        roundLengthInSeconds!: number;

        @Prop({ required: true })
        totalRounds!: number;

        open: boolean = true;

        roundEnd: any;
        roundStart: any;
        getContractData: any;
        contractName!: string;

        endingIn: string = '';

        created() {
            this.updateEndingInTime();
            setInterval(this.updateEndingInTime, 1000);
        }

        updateEndingInTime() {
            const now = moment().utc(false);

            const roundStart = this.roundStart(this.currentRound, this.auctionStartTime);
            const roundEnd = this.roundEnd(this.currentRound, this.auctionStartTime, this.roundLengthInSeconds);

            this.open = now >= roundStart && now <= roundEnd;

            const duration = moment.duration(roundEnd.diff(now));
            this.endingIn = `${Math.ceil(duration.get('hours'))}h ${Math.ceil(duration.get('minutes'))}m ${Math.ceil(duration.get('seconds'))}s`;
        }
    };
</script>

<style scoped>
    .current-auction-container {
        margin-top: 6rem;
        border-top: 1px solid #343a40;
    }

    .header-container {
        margin-bottom: 3rem;
    }

    .current-round-counter {
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

    .ending-container {
        text-align: center;
        margin-bottom: 3rem;
    }

    .not-started {
        text-align: center;
        margin-bottom: 3rem;
        color: dodgerblue;
        font-size: 1.75rem;
    }

    .ending-label {
        text-transform: uppercase;
        letter-spacing: .2em;
        font-size: 80%;
        font-weight: 500;
    }

    .ending-time {
        font-size: 1.25rem;
        font-weight: 600;
    }
</style>
