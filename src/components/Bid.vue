<template>
    <div>
        <h1>Auction bid</h1>
        <hr/>
        <h2>Contract</h2>
        <drizzle-contract
                contractName="TwistedAuctionMock"
                method="currentRound"
                label="Current Round"
        />
        <drizzle-contract
                contractName="TwistedAuctionMock"
                method="highestBidFromRound"
                label="Highest bid"
                :methodArgs="highestBidFromRoundArgs"
        />
        <drizzle-contract
                contractName="TwistedAuctionMock"
                method="highestBidderFromRound"
                label="Highest bidder"
                :methodArgs="highestBidFromRoundArgs"
        />
        <drizzle-contract
                contractName="TwistedAuctionMock"
                method="winningRoundParameter"
                label="Current Selected Parameter"
                :methodArgs="highestBidFromRoundArgs"
        />
        <form>
            <div>
                <label for="parameter-input">
                    Parameter:
                    <input id="parameter-input" type="number" v-model="parameter"/>
                </label>
            </div>
            <div>
                <label for="bid-amount-input">
                    Bid amount:
                    <input id="bid-amount-input" type="number" v-model="bid"/>
                </label>
            </div>
            <input type="submit"/>
        </form>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import {mapGetters} from 'vuex'

    export default Vue.extend({
        name: 'Bid',
        data: () => {
            return {
                parameter: 0,
                bid: 0,
                highestBidFromRoundArgs: [1]
            };
        }, computed: mapGetters('drizzle', ['isDrizzleInitialized'])
    });
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
