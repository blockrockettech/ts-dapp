<template>
  <div class="about container text-center">
  	<span class="text-large">The genesis auction will be starting in:</span><br/>
		<span class="h1">{{startingIn}}</span>
  </div>
</template>

<script lang="ts">
	import Vue from 'vue'
	import Component from 'vue-class-component'
	import moment from 'moment'

	const startingTime = moment("2019-11-02T11:00+00:00");

	@Component({})

	export default class MyComponent extends Vue {
	  startingIn: string = "";
	  created (): void {
			this.updateStartingTime();
			setInterval( this.updateStartingTime, 1000);
	  }  
	  updateStartingTime(){
			const now = moment().utc(false);
			const duration = moment.duration(startingTime.diff(now))

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
