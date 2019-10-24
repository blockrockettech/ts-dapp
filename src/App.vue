<template>
    <div id="app">
    		<div class="container-fluid header">
    			<div class="row ">
    				<div class="col-12 col-md-6 mt-3 text-center text-md-left">
			        <router-link to="/" exact>
			        	<img src="./assets/Logo.svg" class="PageLogo" alt=""/>
			        </router-link>&nbsp;
    				</div>
    				<div class="col-12 col-md-6 mt-3 text-center text-md-right">
				        <div id="nav" class="d-block ml-auto text-medium">
				            <router-link to="/genesis-auction" exact>Genesis Auction</router-link>&nbsp;
				            <router-link to="/faq">FAQ</router-link>
				            <router-link to="/about">About</router-link>
				        </div>
    				</div>
    			</div>
    		</div>
        <router-view />
        <div class="footer container-fluid">
            <div class="row py-3 small">
            		<span class="col-12 col-md-4 text-center text-md-left">
                    <a href="https://twistedsister.io" target="_blank" class="footer-link">twistedsister.io</a>
            		</span>

            		<span class="col-12 col-md-8 text-center text-md-right">

				            <span class="footer-link d-block d-md-inline"><router-link to="/disclaimer">Disclaimer</router-link></span>

                    <span class="footer-link d-block d-md-inline">dApp by: <a href="https://blockrocket.tech" target="_blank">BlockRocket</a></span>

                    <span class="footer-link d-block d-md-inline">Current Ethereum Network: {{currentNetwork}}</span>
                 </span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { mapGetters } from 'vuex';
    import { Component, Vue } from 'vue-property-decorator';

    import { getNetworkName } from '@blockrocket/vue-drizzle-utils';

    @Component({
        computed: {
            ...mapGetters('drizzle', ['drizzleInstance', 'isDrizzleInitialized']),
            ...mapGetters('contracts', ['getContractData', 'contractInstances']),
            ...mapGetters(['contractName'])
        }
    })
    export default class App extends Vue {
        contractName!: string;
        isDrizzleInitialized!: boolean;
        drizzleInstance: any;

        created() {
            this.$store.dispatch('drizzle/REGISTER_CONTRACT', {
                contractName: this.contractName,
                method: 'auctionStartTime',
                methodArgs: []
            });

            this.$store.dispatch('drizzle/REGISTER_CONTRACT', {
                contractName: this.contractName,
                method: 'minBid',
                methodArgs: []
            });

            this.$store.dispatch('drizzle/REGISTER_CONTRACT', {
                contractName: this.contractName,
                method: 'currentRound',
                methodArgs: []
            });

            this.$store.dispatch('drizzle/REGISTER_CONTRACT', {
                contractName: this.contractName,
                method: 'numOfRounds',
                methodArgs: []
            });

            this.$store.dispatch('drizzle/REGISTER_CONTRACT', {
                contractName: this.contractName,
                method: 'roundLengthInSeconds',
                methodArgs: []
            });
        }

        get currentNetwork() {
            if (this.isDrizzleInitialized) {
                return getNetworkName(this.drizzleInstance).toUpperCase();
            }

            return null;
        }
    }
</script>

<style lang="scss">
    @import './styles/_index.scss';

    .header{
    	margin-bottom: 5rem;
    }
    #nav {
    		line-height: .8;
        a {
          margin-left: 1rem;
          margin-right: 1rem;
        }
        a.router-link-active{
          color: #000;
        }
    }
    .PageLogo{
    	max-width: 400px;
    }
    .footer{
    	border-top: 1px solid black;
      margin-top: 4rem;
    }
    .footer-link{
    	margin-left: 1em;
    	margin-right: 1em;
    }

</style>
