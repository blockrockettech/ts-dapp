<template>
    <div>
        <CurrentAuction />
        <PreviousAuction v-for="roundNo in previousRoundNums"
                         :roundNo="roundNo"
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
        computed: {...mapGetters(['contractName', 'currentRound'])}
    })
    export default class Auction extends Vue {
        currentRound!: number;

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
