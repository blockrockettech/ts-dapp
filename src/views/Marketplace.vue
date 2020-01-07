<template>
    <div class="Market container">

        <h1 class="mb-4">Marketplace</h1>

        <p class="text-large mb-6">Buy and sell twistedsister.io tokens.</p>

        <!--        <div class="row mb-6">-->
        <!--            <div class="col-12 col-md-6 offset-md-3 MarketItem text-center">-->
        <!--                <img src="https://ipfs.infura.io/ipfs/QmVwaos28xfw5j5J5bB8WAfszmGMF3PFZiZW1u3BghbBNT" alt="" class="" />-->
        <!--                <div>-->
        <!--                    <h4>Twistedsieter</h4>-->
        <!--                    <p><span>Token owner: </span><br><span>0xE206473a2eE508426812178c40B8e545AC30843F</span></p>-->
        <!--                    <div class="mb-3 pt-2">-->
        <!--                        Offer your Token (in ETH):<br>-->
        <!--                        <b-input-group>-->
        <!--                            <b-form-input type="number" step="0.02" class="" />-->
        <!--                            <b-input-group-append>-->
        <!--                                <b-button variant="dark" >→ Offer</b-button>-->
        <!--                            </b-input-group-append>-->
        <!--                        </b-input-group>-->
        <!--                    </div>-->
        <!--                    <div class="mb-3 pt-2">-->
        <!--                        Current Offer: <br><span class="text-large">2.56 ETH</span><br>-->
        <!--                        <b-button variant="dark" >remove your offer</b-button>-->
        <!--                        <b-button variant="dark" >buy token</b-button>-->
        <!--                    </div>-->
        <!--                    <div class="border-top border-bottom py-2">-->
        <!--                        Transfer Token to adress:<br>-->
        <!--                        <b-form-input type="text" step="0.02" class="w-100" />-->
        <!--                        <b-button variant="dark" >→ Offer</b-button>-->
        <!--                    </div>-->
        <!--                </div>-->
        <!--            </div>-->
        <!--        </div>-->

        <h2>All Tokens</h2>
        <div class="row mt-3 mb-6">
            <Token :key="idx" :tokenId="tokenId" v-for="(tokenId, idx) in tokenIds"/>
        </div>
    </div>
</template>

<script>
    import Token from "@/components/marketplace/Token";

    export default {
        name: "Marketplace",
        components: {Token},
        data() {
            return {
                tokenIds: [
                    ...Array(22).keys()
                ].map(id => id + 1)
            }
        }
    }
</script>

<style scoped>

</style>
