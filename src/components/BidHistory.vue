<template>
    <div class="bid-history-container">
        <h3 class="mb-3">
            BID HISTORY
        </h3>
        <div class="highest-bid-container">
            <div class="header">
                <span>Highest Bid</span>
            </div>
            <div class="highest-bid-row row">
                <span class="col">{{highestBid.elapsedTime}}</span>
                <span class="col-6">{{highestBid.address}}</span>
                <span class="col">{{highestBid.amount}} ETH</span>
            </div>
        </div>
        <div>
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
</template>

<script lang="ts">
    import { mapGetters } from 'vuex';
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component({
        computed: {
            ...mapGetters('drizzle', ['drizzleInstance', 'isDrizzleInitialized']),
            ...mapGetters('contracts', ['getContractData', 'contractInstances'])
        }
    })
    export default class BidHistory extends Vue {
        @Prop({ required: true })
        currentRound!: number;

        @Prop({ required: true })
        auctionContractName!: string;

        drizzleInstance: any;
        isDrizzleInitialized!: boolean;
        getContractData: any;

        get highestBid(): any {
            return {
                elapsedTime: '15 seconds ago',
                address: '0xd12cd8a37f074e7eafae618c986ff8256661ffca',
                amount: '0.55'
            };
        }

        get previousBids(): any[] {
            return [
                {elapsedTime: '20 seconds ago', address: '0xd12cd8a37f074e7eafae618c986ff825666198ba', amount: '0.50'},
                {elapsedTime: '25 seconds ago', address: '0xd12cd8a37f074e7eafae618c986ff825666198bf', amount: '0.25'},
                {elapsedTime: '29 seconds ago', address: '0xd12cd8a37f074e7eafae618c986ff825666198bc', amount: '0.01'},
            ];
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