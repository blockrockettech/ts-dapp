<template>
    <div class="col-12 col-sm-6 col-lg-4 MarketItem text-center">
        <div v-if="!loading">
            <img :src="metadata.ipfsImageUrl" alt=""/>
            <div class="mt-2 mb-4">
                <h4 class="mb-2">Token #{{tokenId}}</h4>

                <div class="mb-4">
                    <span class="mb-1 text-muted">Token owner:</span>
                    <span v-if="account !== metadata.owner" class="ml-2 small"><br/>{{metadata.owner}}</span>
                    <span class="text-medium text-bold ml-2" v-else>You</span>
                </div>

                <div class="mb-4">
                    <div v-if="metadata.listing.listed">
                        <div class="text-muted">Price:</div>
                        <div>
                            <span class="text-large">{{metadata.listing.listPrice}} ETH</span>
                        </div>
                        <div class="mt-2" v-if="account === metadata.owner">
                            <b-button variant="outline-dark" @click="delist">
                                <span v-if="!delisting">De-list</span>
                                <SmallSpinner v-else/>
                            </b-button>
                        </div>
                        <div class="mt-2" v-else>
                            <b-button variant="dark" @click="buyToken">
                                <span v-if="!buying">Buy Token</span>
                                <SmallSpinner v-else/>
                            </b-button>
                        </div>
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
                                <span v-if="!listing">List Token</span>
                                <SmallSpinner v-else/>
                            </b-button>
                        </div>
                        <div v-else>
                            <span class="text-large">Not for sale</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="" v-if="account === metadata.owner">
                <hr/>
                <label class="text-center">
                    Transfer Token to address:
                </label>
                <b-form-input type="text" class="w-100" v-model="transferAddress"/>
                <b-button variant="outline-dark" class="mt-2" @click="transfer">
                    <span v-if="!transferring">→ Transfer</span>
                    <SmallSpinner v-else />
                </b-button>
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
                listing: false,
                buying: false,
                transferring: false,
                delisting: false,
                transferAddress: "",
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

                    const ipfsTokenData = await axios.get(ipfsTokenDataUrl, {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });
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
                this.listing = true;
                const {TwistedSisterToken, BuyNowNFTMarketplace} = this.contracts;
                let tx = await TwistedSisterToken.approve(BuyNowNFTMarketplace.address, this.tokenId);
                let receipt = await tx.wait(1);
                console.log(`Approve receipt: `, receipt);

                const listPriceEth = this.metadata.listing.listPrice.toString();
                tx = await BuyNowNFTMarketplace.listToken(this.tokenId, utils.parseEther(listPriceEth));
                receipt = await tx.wait(1);
                console.log(`List token receipt: `, receipt);
                this.listing = false;
                document.location.reload();
            },
            async buyToken() {
                this.buying = true;
                const {BuyNowNFTMarketplace} = this.contracts;
                const ethPrice = this.metadata.listing.listPrice.toString();
                const tx = await BuyNowNFTMarketplace.buyNow(this.tokenId, {
                    value: utils.parseEther(ethPrice),
                });
                let receipt = await tx.wait(1);
                console.log(`Buy now TX receipt: `, receipt);
                this.buying = false;
                document.location.reload();
            },
            async transfer() {
                this.transferring = true;
                const {TwistedSisterToken, BuyNowNFTMarketplace} = this.contracts;

                if (this.metadata.listing.listed) {
                    const delistTx = await BuyNowNFTMarketplace.delistToken(this.tokenId);
                    const delistReceipt = await delistTx.wait(1);
                    console.log(`Delist receipt: `, delistReceipt);
                }

                const tx = await TwistedSisterToken.transferFrom(this.account, this.transferAddress, this.tokenId);
                const receipt = await tx.wait(1);
                console.log(`Transfer receipt: `, receipt);
                this.transferring = false;
                document.location.reload();
            },
            async delist() {
                this.delisting = true;
                const {BuyNowNFTMarketplace} = this.contracts;
                const tx = await BuyNowNFTMarketplace.delistToken(this.tokenId);
                const receipt = await tx.wait(1);
                console.log(`Delist receipt: `, receipt);
                this.delisting = false;
                document.location.reload();
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
