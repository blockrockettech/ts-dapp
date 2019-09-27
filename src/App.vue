<template>
    <div id="app">
        <div class="img-header-container">
            <img src="./assets/Logo.svg" class="img-header" alt=""/>
        </div>
        <div id="nav">
            <router-link to="/concept">Concept</router-link>&nbsp;
            <router-link to="/">Auction</router-link>&nbsp;
            <router-link to="/about">About</router-link>
        </div>
        <router-view />
        <div class="footer">
            <div class="row mt-2 mb-2">
                <span class="col small">
                    <a href="https://twistedsister.io" target="_blank" class="footer-link">twistedsister.io</a>
                </span>
                <span class="col text-center small">
                    Built by: <a href="https://blockrocket.tech" target="_blank">BlockRocket</a>
                </span>
                <span class="col text-center small">
                    Current Ethereum Network: {{currentNetwork}}
                </span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { mapGetters } from 'vuex';
    import { Component, Vue } from 'vue-property-decorator';

    import { getNetworkName } from '@/utils/drizzle/drizzle-utils';

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
                return getNetworkName(this.drizzleInstance);
            }

            return null;
        }
    }
</script>

<style lang="scss">
    @import '../node_modules/bootstrap/scss/bootstrap';

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: rgb(33, 37, 41);
    }

    /*todo: import media queries for max width*/
    #nav {
        margin: 3rem auto;
        width: 100%;
        padding: 0 15px;
        font-size: 1.75rem;
        text-align: center;

        a {
            font-weight: bold;
            color: rgb(33, 37, 41);
            text-decoration: none;
        }

        a:hover {
            text-decoration: underline;
        }
    }

    .img-header-container {
        padding: 0 1rem;
        margin: 1rem 0;
    }

    .img-header {
        width: 100%;
    }

    .footer {
        border-top: 1px solid black;
        margin-top: 2rem;
        padding: 20px;
    }

    .footer-link {
        text-decoration: none;
        color: black;
    }
</style>
