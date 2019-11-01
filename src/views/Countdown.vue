<template>
    <div v-if="!expired" class="container text-center">
        <span class="text-large">The genesis auction will be starting in:</span><br/>
        <span class="h1">{{startingIn}}</span>
    </div>
    <Auction v-else/>
</template>

<script lang="ts">
    import Vue from 'vue'
    import Component from 'vue-class-component'
    import moment from 'moment'
    import Auction from "@/views/Auction.vue";

    const startingTime = moment("2019-11-02T08:00+00:00");

    @Component({
        components: {Auction}
    })

    export default class MyComponent extends Vue {
        startingIn: string = "";
        expired: boolean = true;

        created(): void {
            this.updateStartingTime();
            setInterval(this.updateStartingTime, 1000);
        }

        updateStartingTime() {
            const now = moment().utc(false);
            const duration = moment.duration(startingTime.diff(now))
            if( startingTime.diff(now) < 0 ){
                this.expired = true;
            }
            this.startingIn = `
				${Math.ceil(duration.get('days'))}d 
				${Math.ceil(duration.get('hours'))}h 
				${Math.ceil(duration.get('minutes'))}m 
				${Math.ceil(duration.get('seconds'))}s
			`;
        }
    }
</script>

<style scoped>
</style>
