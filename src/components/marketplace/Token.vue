<template>
    <div class="col-12 col-sm-6 col-lg-4 MarketItem text-center">
        <div v-if="!loading">
            <img :src="metadata.ipfsImageUrl" alt=""/>
            <div class="mt-2">
                <h4>Token #{{tokenId}}</h4>

                <div class="mb-2">
                    <div class="mb-1">Token owner:</div>
                    <div v-if="account !== metadata.owner">{{metadata.owner}}</div>
                    <div class="text-success text-medium text-bold" v-else>You</div>
                </div>

                <div class="mb-3 pt-2">
                    <div v-if="metadata.listing.listed">
                        <div>Price:</div>
                        <div>
                            <span class="text-large">{{metadata.listing.listPrice}} ETH</span>
                        </div>
                        <b-button variant="dark" @click="buyToken">
                            Buy Token
                        </b-button>
                    </div>
                    <div v-else>
                        <div class="mt-2" v-if="account === metadata.owner">
                            <label class="text-center" for="listPriceInput">
                                List for:
                            </label>
                            <div>
                                <input id="listPriceInput" class="form-control d-inline-block" v-model="metadata.listing.listPrice"/> ETH
                            </div>
                            <b-button variant="dark" @click="listToken" class="mt-2">
                                List Token
                            </b-button>
                        </div>
                        <div v-else>
                            <span class="text-large">Not for sale</span>
                        </div>
                    </div>
                </div>
<!--                <div class="py-2">-->
<!--                    Transfer Token to adress:<br>-->
<!--                    <b-form-input type="text" step="0.02" class="w-100"/>-->
<!--                    <b-button variant="dark" class="mt-2">→ Transfer</b-button>-->
<!--                </div>-->
            </div>
        </div>
        <div v-else>
            <SmallSpinner/>
        </div>
    </div>
</template>

<script>
    import SmallSpinner from "@/components/SmallSpinner";

    import {mapGetters} from 'vuex';
    import axios from 'axios';
    import {utils} from 'ethers';

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
                    ipfsImageUrl: null,
                    listing: {
                        listed: false,
                        listPrice: 0
                    }
                }
            }
        },
        methods: {
            async fetchTokenOwner() {
                const {TwistedSisterToken} = this.contracts;
                this.metadata.owner = await TwistedSisterToken.ownerOf(this.tokenId);
            },
            async fetchIPFSImage() {
                try {
                    // Fallback incase IPFS call fails
                    this.metadata.ipfsImageUrl = `https://robohash.org/${this.tokenId}.png`;

                    const {TwistedSisterToken} = this.contracts;
                    const ipfsTokenDataUrl = await TwistedSisterToken.tokenURI(Number(this.tokenId));

                    const ipfsTokenData = await axios.get(ipfsTokenDataUrl);
                    this.metadata.ipfsImageUrl = ipfsTokenData.data.image;
                } catch(e) {
                    console.log(`Failed to fetch IPFS image for ${this.tokenId}`)
                }
            },
            async fetchListPrice() {
                const {BuyNowNFTMarketplace} = this.contracts;
                const listedTokenPriceInWei = await BuyNowNFTMarketplace.listedTokenPrice(this.tokenId);

                if(Number(listedTokenPriceInWei.toString())) {
                    const listedTokenPriceInEth = utils.formatEther(listedTokenPriceInWei);
                    this.metadata.listing.listed = true;
                    this.metadata.listing.listPrice = Number(listedTokenPriceInEth);
                } else {
                    this.metadata.listing.listed = false;
                    this.metadata.listing.listPrice = 0;
                }
            },
            async fetchTokenData() {
                await this.fetchTokenOwner();
                await this.fetchIPFSImage();
                await this.fetchListPrice();
            },
            async listToken() {
                const {TwistedSisterToken, BuyNowNFTMarketplace} = this.contracts;
                let tx = await TwistedSisterToken.approve(BuyNowNFTMarketplace.address, this.tokenId);
                let receipt = await tx.wait(1);
                console.log(`Approve receipt: `, receipt);

                const listPriceEth = this.metadata.listing.listPrice.toString();
                tx = await BuyNowNFTMarketplace.listToken(this.tokenId, utils.parseEther(listPriceEth));
                receipt = await tx.wait(1);
                console.log(`List token receipt: `, receipt);
            },
            async buyToken() {
                const {BuyNowNFTMarketplace} = this.contracts;
                const ethPrice = this.metadata.listing.listPrice.toString();
                const tx = await BuyNowNFTMarketplace.buyNow(this.tokenId, {
                    value: utils.parseEther(ethPrice),
                });
                let receipt = await tx.wait(1);
                console.log(`Buy now TX receipt: `, receipt);
            }
        },
        async mounted() {
            if (this.contracts) {
                await this.fetchTokenData();
                this.loading = false;
            }
        },
        watch: {
            contracts: async function (newVal, oldVal) {
                // Should only run once
                if (newVal && !oldVal) {
                    await this.fetchTokenData();
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