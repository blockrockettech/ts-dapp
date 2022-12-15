<template>
    <div>
        <div class="Market container" v-if="account">

            <div class="row">
                <div class="col"><h1 class="mb-4">Marketplace</h1></div>
                <div class="col text-right"><a href="https://ipfs.io/ipfs/QmbRqakXKPWn1Z8yznr3GkMeWgsdbHZuZSBymEk262ssVn">Download 3D Model (IPFS)</a></div>
            </div>

            <hr/>

            <div class="row mt-3 mb-6">
                <Token :key="idx" :tokenId="tokenId" v-for="(tokenId, idx) in tokenIds"/>
            </div>
        </div>
        <div v-else class="container text-center text-danger text-large">
            Please install and unlock a Web3 client such as <a href="https://metamask.io/">metamask.io</a> and refresh the page.
        </div>
    </div>
</template>

<script>
    import Token from "@/components/marketplace/Token";
    import {mapGetters} from "vuex";

    export default {
        name: "Marketplace",
        components: {Token},
        computed: {
            ...mapGetters(['account'])
        },
        data() {
            return {
                tokenIds: [
                    ...Array(21).keys()
                ].map(id => id + 1)
            };
        }
    };
</script>

<style scoped>

</style>
