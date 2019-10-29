<template>
    <div>
        <CurrentAuction :currentRound="currentRound"
                        :totalRounds="totalRounds"
                        :auctionStartTime="auctionStartTime"
                        :roundLengthInSeconds="roundLengthInSeconds" />
        <!--<PreviousAuction v-for="roundNo in previousRoundNums"
                         :roundNo="roundNo"
                         :totalRounds="totalRounds"
                         :auctionStartTime="auctionStartTime"
                         :roundLengthInSeconds="roundLengthInSeconds"
                         :key="roundNo" />-->
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
            ...mapGetters(['auctionData'])
        }
    })
    export default class Auction extends Vue {

        // Mapped Getters
        auctionData: any;

        get totalRounds() {
            return this.auctionData.totalRounds ? this.auctionData.totalRounds : 21;
        }

        get roundLengthInSeconds() {
            return this.auctionData.roundLengthInSeconds ? this.auctionData.roundLengthInSeconds : 43200;
        }

        get currentRound() {
            return this.auctionData.currentRoundNumber ? this.auctionData.currentRoundNumber : 1;
        }

        get auctionStartTime() {
            return this.auctionData.auctionStartTime ? this.auctionData.auctionStartTime
                : Math.floor( Date.now() / 1000 );
        }

        get previousRoundNums() {
            if (this.currentRound > 1) {
                const arrayStartingFromZero = Array.from(Array(this.currentRound - 1).keys()).reverse();
                return arrayStartingFromZero.map(el => {
                    return el + 1;
                });
            } else {
                return [];
            }
        }
    };
</script>

<style scoped>

</style>
