<template>
    <div>
        <CurrentAuction />
        <PreviousAuction v-for="roundNo in remainingRoundNums"
                         :roundNo="roundNo"
                         :key="roundNo" />
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import CurrentAuction from '@/components/CurrentAuction.vue'; // @ is an alias to /src
    import PreviousAuction  from "@/components/PreviousAuction.vue";

    export default Vue.extend({
        name: 'auction',
        components: {
            CurrentAuction,
            PreviousAuction
        },
        computed: {
            remainingRoundNums() {
                return [
                    2,
                    1
                ];
            }
        }
    });
</script>

<style scoped>

</style>
