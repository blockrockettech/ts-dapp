<template>
    <div>
        <CurrentAuction :currentRound="currentRound"
                        :totalRounds="totalRounds"
                        :auctionStartTime="auctionStartTime"
                        :roundLengthInSeconds="roundLengthInSeconds" />
        <PreviousAuction v-for="roundNo in previousRoundNums"
                         :roundNo="roundNo"
                         :totalRounds="totalRounds"
                         :key="roundNo" />
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
            ...mapGetters(['contractName']),
            ...mapGetters('contracts', ['getContractData'])
        }
    })
    export default class Auction extends Vue {
        getContractData: any;
        contractName!: string;

        get totalRounds() {
            const total = this.getContractData({
                contract: this.contractName,
                method: 'numOfRounds'
            });

            if (total !== 'loading') {
                return total;
            }

            return 21;
        }

        get roundLengthInSeconds() {
            const length = this.getContractData({
                contract: this.contractName,
                method: 'roundLengthInSeconds'
            });

            if (length !== 'loading') {
                return length;
            }

            return 43200;
        }

        get currentRound() {
            const round = this.getContractData({
                contract: this.contractName,
                method: 'currentRound'
            });

            if(round !== 'loading') {
                return round;
            }

            return 1;
        }

        get auctionStartTime() {
            const startTimeUnixEpoch = this.getContractData({
                contract: this.contractName,
                method: 'auctionStartTime'
            });

            if (startTimeUnixEpoch !== 'loading') {
                return startTimeUnixEpoch;
            }

            return Math.floor( Date.now() / 1000 );
        }

        get previousRoundNums() {
            if (this.currentRound > 1) {
                const arrayStartingFromZero = Array.from(Array(this.currentRound - 1).keys()).reverse();
                return arrayStartingFromZero.map((el) => {
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
