<template>
    <div v-if="account">
        <CurrentAuction :currentRound="currentRound"
                        :totalRounds="totalRounds"
                        :auctionStartTime="auctionStartTime"
                        :roundLengthInSeconds="roundLengthInSeconds" />
        <PreviousAuction v-for="round in previousRounds"
                         :round="round"
                         :totalRounds="totalRounds"
                         :key="round._round" />
    </div>
    <div v-else class="container text-center text-danger">
        Please install and unlock a Web3 client such as <a href="https://metamask.io/">metamask.io</a> and refresh the page.
    </div>
</template>

<script lang="ts">
    import { mapGetters } from 'vuex';
    import { Component, Vue } from 'vue-property-decorator';
    import CurrentAuction from '@/components/CurrentAuction.vue';
    import PreviousAuction  from "@/components/PreviousAuction.vue";

    @Component({
        components: {CurrentAuction, PreviousAuction},
        computed: {
            ...mapGetters(['auctionData','contracts','account'])
        }
    })
    export default class Auction extends Vue {

        // Mapped Getters
        auctionData: any;
        account: any;

        get totalRounds() {
            return this.auctionData.totalRounds ? this.auctionData.totalRounds : 21;
        }

        get roundLengthInSeconds() {
            return this.auctionData.roundLengthInSeconds ? this.auctionData.roundLengthInSeconds : 43200;
        }

        get currentRound() {
            return this.auctionData.currentRound.roundNumber ?
                this.auctionData.currentRound.roundNumber : 1;
        }

        get auctionStartTime() {
            return this.auctionData.auctionStartTime ? this.auctionData.auctionStartTime
                : Math.floor( Date.now() / 1000 );
        }

        get previousRounds() {
            if (this.auctionData.events.roundFinalised && this.auctionData.events.roundFinalised.length) {
                return this.auctionData.events.roundFinalised;
            } else {
                return [];
            }
        }
    };
</script>

<style scoped>

</style>
