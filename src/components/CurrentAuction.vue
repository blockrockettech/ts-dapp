<template>
    <div class="current-auction-container">
        <div class="header-container">
            <span class="current-round-counter">
                #3 / 21
            </span>
            <span class="header">
                Current Auction
            </span>
        </div>
        <div class="ending-container">
            <span class="ending-label">Ending in:</span>
            <br/>
            <span class="ending-time">01h 10min 03min</span>
        </div>

        <AuctionBid :auctionContractName="auctionContractName"
                    :currentRound="currentRound" />

        <BidHistory :auctionContractName="auctionContractName"
                    :currentRound="currentRound" />
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import AuctionBid from '@/components/AuctionBid.vue';
    import BidHistory from '@/components/BidHistory.vue';

    @Component({ components: {AuctionBid, BidHistory} })
    export default class CurrentAuction extends Vue {
        @Prop({ required: true })
        auctionContractName!: string;

        currentRound: number = 1;
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