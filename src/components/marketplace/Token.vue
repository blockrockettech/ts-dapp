<template>
    <div class="col-12 col-sm-6 col-lg-4 MarketItem text-center">
        <div v-if="!loading">
            <img src="https://ipfs.infura.io/ipfs/QmVwaos28xfw5j5J5bB8WAfszmGMF3PFZiZW1u3BghbBNT" alt="" class=""/>
            <div class="mt-2">
                <h4>Token #{{tokenId}}</h4>

                <div class="mb-2">
                    <div class="mb-1">Token owner: </div>
                    <div v-if="account !== metadata.owner">{{metadata.owner}}</div>
                    <div class="text-success text-medium text-bold" v-else>You</div>
                </div>

                <div class="mb-3 pt-2">
                    Price: <br><span class="text-large">2.56 ETH</span><br>
                    <b-button variant="dark">buy token</b-button>
                </div>
                <div class="py-2">
                    Transfer Token to adress:<br>
                    <b-form-input type="text" step="0.02" class="w-100"/>
                    <b-button variant="dark" class="mt-2">→ Transfer</b-button>
                </div>
            </div>
        </div>
        <div v-else>
            <SmallSpinner/>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import SmallSpinner from "@/components/SmallSpinner";

    export default {
        name: "Token",
        props: ["tokenId"],
        components: {SmallSpinner},
        computed: {
          ...mapGetters(['contracts', 'account'])
        },
        data() {
          return {
              loading: true,
              metadata: {
                  owner: null,
                  listPrice: 0
              }
          }
        },
        methods: {
          async fetchTokenOwner() {
              const {TwistedSisterToken} = this.contracts;
              this.metadata.owner = await TwistedSisterToken.ownerOf(this.tokenId);
          }
        },
        mounted() {
            if(this.contracts) {
                this.fetchTokenOwner();
                this.loading = false;
            }
        },
        watch: {
            contracts: async function (newVal, oldVal) {
                // Should only run once
                if(newVal && !oldVal) {
                    console.log(`Fetching token owner of ${this.tokenId}`);
                    this.fetchTokenOwner();
                    this.loading = false;
                }
            }
        },
    }
</script>

<style scoped>
    .MarketItem {
        margin-bottom: 3rem;
        word-break: break-all;
    }

    .MarketItem img {
        display: block;
        max-width: 100%;
    }
</style>