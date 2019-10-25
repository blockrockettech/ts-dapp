<template>
	<div class="current-auction-container">


			<div class="auction-header container mb-4">
				<div class="row">
					<span class="round-counter col h1 mb-0">
						#{{currentRound}} / {{totalRounds}}
					</span>
					<span class="col text-right">
						Current Auction
					</span>
				</div>
			</div>


			<div class="auction-container container pt-4" v-if="true">
				<div class="ending-container text-center ">
					<div class="mb-5">
						<span class="text-large">The current auction will be ending in:</span>
						<br/>
						<span class="h1">{{ endingIn }}</span>
					</div>
				</div>
				<AuctionBid :currentRound="currentRound" />
				<BidHistory :currentRound="currentRound" />
			</div>


			<div class="auction-container next-auction container pt-4" v-else>
				<span>
				  <small>twistedsister is in regeneration mode</small>
				</span>
				<br/>
				<span class="text-large">The bidding window will open in:</span>
				<br/>
				<span class="h1">{{ startingIn }}</span>
			</div>


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
		startingIn: string = '';
		created() {
			this.updateTimes();
			setInterval( this.updateTimes, 1000);
		}
		updateTimes(){
			this.updateEndingInTime();
			this.updateStartingInTime();
		}
		updateStartingInTime(){
			const now = moment().utc(false);
			const roundStart = this.roundStart(this.currentRound, this.auctionStartTime);
			const duration = moment.duration(roundStart.diff(now));
			this.startingIn = `${Math.ceil(duration.get('hours'))}h ${Math.ceil(duration.get('minutes'))}m ${Math.ceil(duration.get('seconds'))}s`;
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
	.current-auction-container{
	}
	.auction-container{
		border-top: 1px solid #DDD;
	}
	.auction-header{
		line-height: 1;
	}
	.next-auction{
		text-align: center;
	}
</style>
