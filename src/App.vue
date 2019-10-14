<template>
    <div id="app">
    		<div class="container-fluid mb-6">
    			<div class="row ">

    				<div class="col-12 col-md-6 my-3 text-center text-md-left">
			        <router-link to="/" exact>
			        	<img src="./assets/Logo.svg" class="PageLogo" alt=""/>
			        </router-link>&nbsp;
    				</div>

    				<div class="col-12 col-md-6 my-3 text-center text-md-right">
				        <div id="nav" class="d-block ml-auto text-medium">
				            <router-link to="/auction" exact>Auction</router-link>&nbsp;
				            <router-link to="/faq">FAQ</router-link>
				            <router-link to="/about">About</router-link>
				        </div>
    				</div>

    			</div>
    		</div>



        <router-view />
        <div class="footer container-fluid">
            <div class="row py-3 border-top border-dark small">
                <span class="col text-left">
                    <a href="https://twistedsister.io" target="_blank" class="footer-link">twistedsister.io</a>
                </span>
                <span class="col text-center">
                    Built by: <a href="https://blockrocket.tech" target="_blank">BlockRocket</a>
                </span>
                <span class="col text-right">
                    Current Ethereum Network: {{currentNetwork}}
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

    #app {
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
      margin-top: 8rem;
    }

</style>
