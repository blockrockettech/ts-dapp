<template>
    <div class="Market container">

        <h1 class="mb-4">Marketplace</h1>

        <p class="text-large mb-6">Buy and sell twistedsister.io tokens.</p>

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
