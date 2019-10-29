<template>
    <div class="previous-auction-container mb-6">

			<div class="auction-header container mb-4">
				<div class="row">
					<span class="round-counter col h1 mb-0">
						#{{round._round}} / {{totalRounds}}
					</span>
					<span class="col text-right">
						Previous Auction
					</span>
				</div>
			</div>

        <div class="auction-container container pt-4">
            <div class="mb-4">
                <img :src="ipfsImageUrl" alt="" class="img-container d-block w-auto mw-100 h-auto mx-auto"/>
            </div>
            <div class="details-container text-center">
                <div class="mb-3">
                    <span class="small">Token Minted</span>
                    <br/>
                    <span class="text-medium">
                        {{roundEndDay}}
                        ,
                        {{roundEndTime}} (UTC)
                    </span>
                </div>
                <div class="mb-3">
                    <span class="small">Owner</span>
                    <br/>
                    <span class="text-medium">
                        {{highestBidder}}
                    </span>
                </div>
                <div class="mb-4">
                    <span class="small">Bid</span>
                    <br/>
                    <span class="text-medium">
                        {{highestBid}} ETH
                    </span>
                </div>
                <div class="small mt-1">
                    <a :href="openSeaUrl" target="_blank">→ view token on OpenSea</a>
                </div>
                <div class="small mt-1">
                    <a :href="etherscanTokenUrl" target="_blank">→ view token on Etherscan</a>
                </div>
                <div class="small mt-1">
                    <a :href="ipfsTokenDataUrl" target="_blank">→ view token data on IPFS</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Moment } from 'moment';
    import moment from 'moment';
    import _ from 'lodash';
    import axios from 'axios';
    import { ethers } from 'ethers';
    import { mapGetters } from 'vuex';
    import { Component, Prop, Watch, Vue } from 'vue-property-decorator';

    @Component({
        computed: {
            ...mapGetters(['getBaseUrls'])
        }
    })
    export default class PreviousAuction extends Vue {
        @Prop({ required: true })
        round!: any;

        @Prop({ required: true })
        totalRounds!: number;

        getBaseUrls: any;

        isDrizzleInitialized!: boolean;
        contractName!: string;
        drizzleInstance: any;

        provider: any = null;
        signer: any = null;

        ipfsTokenDataUrl: string = '';
        ipfsImageUrl: string = '';

        async mounted() {
            /*console.log('given provider',this.drizzleInstance.web3.givenProvider);

                this.provider = new ethers.providers.Web3Provider(this.drizzleInstance.web3.givenProvider);

                console.log('ethers provider', this.provider);

                this.signer = this.provider.getSigner();

                const tokenContract = new ethers.Contract(
                    this.tokenContractAddress(this.drizzleInstance),
                    TwistedSisterToken.abi,
                    this.signer,
                );

                this.ipfsTokenDataUrl = await tokenContract.tokenURI(Number(this.roundNo));
                const ipfsTokenData: any = await axios.get(this.ipfsTokenDataUrl);
                this.ipfsImageUrl = ipfsTokenData.data.image;*/
        }

        get openSeaUrl(): string {
            if (!this.getBaseUrls) return '';
            return `${this.getBaseUrls.openSea}/${this.round._round}`;
        }

        get roundEndDay() {
            return moment.unix(this.round._timestamp).utc(false).format('DD MMMM YYYY');
        }

        get roundEndTime() {
            return moment.unix(this.round._timestamp).utc(false).format('hh:mma');
        }

        get highestBidder() {
            return this.round._highestBidder;
        }

        get highestBid() {
            return this.round._highestBid;
        }

        get etherscanTokenUrl() {
            if (!this.getBaseUrls) return '';
            return `${this.getBaseUrls.etherScan}?a=${this.round._round}`;
        }
    }
</script>

<style scoped>


	.previous-auction-container{
	}

	.auction-header{
	}

	.auction-container{
		border-top: 1px solid #DDD;
	}



</style>
