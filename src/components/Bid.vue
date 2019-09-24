<template>
    <div>
        <h1>Auction bid</h1>
        <hr/>
        <h2>Contract</h2>
        <div v-if="isDrizzleInitialized">
            <drizzle-contract
                    contractName="TwistedAuctionMock"
                    method="currentRound"
                    label="Current Round"
            />
            <drizzle-contract
                    contractName="TwistedAuctionMock"
                    method="highestBidFromRound"
                    label="Highest bid"
                    :methodArgs="roundArgs"
            />
            <div><strong>Highest bid:</strong> {{ highestBidInETH }} <strong>(ETH)</strong> </div>
            <drizzle-contract
                    contractName="TwistedAuctionMock"
                    method="highestBidderFromRound"
                    label="Highest bidder"
                    :methodArgs="roundArgs"
            />
            <drizzle-contract
                    contractName="TwistedAuctionMock"
                    method="winningRoundParameter"
                    label="Current Parameter"
                    :methodArgs="roundArgs"
            />
        </div>
        <div v-else>Loading...</div>
        <br/>
        <hr/>
        <ContractFormV2
                contractName="TwistedAuctionMock"
                method="bid"
                :placeholders="['Geo Parameter']"
                :value="bidInWei"
        />
        <div>
            <label for="bid-amount-input">
                Bid amount (ETH):
                <input id="bid-amount-input" type="number" v-model="bid"/>
            </label>
        </div>
        <p>
            Current bid in Wei: {{ bidInWei }}
        </p>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import { mapGetters } from 'vuex';
    import { Component } from 'vue-property-decorator';
    import ContractFormV2 from './ContractFormV2.vue';

    @Component({
        computed: {
            ...mapGetters('drizzle', ['drizzleInstance', 'isDrizzleInitialized']),
            ...mapGetters('contracts', ['getContractData', 'contractInstances'])
        },
        components: {ContractFormV2}
    })
    export default class Bid extends Vue {
        bid: number = 0;
        roundArgs: number[] = [1];

        contractName: string = "TwistedAuctionMock";

        drizzleInstance: any;
        isDrizzleInitialized!: boolean;
        getContractData: any;

        get bidInWei(): number {
            if(this.isDrizzleInitialized) {
                const utils = this.drizzleInstance.web3.utils;
                const bid: string = this.bid.toString();
                return bid !== '' ? utils.toWei(this.bid.toString(), 'ether') : -1;
            }
            return -1;
        }

        get highestBidInETH(): number {
            if(this.isDrizzleInitialized) {
                const arg = {
                    contract: this.contractName,
                    method: 'highestBidFromRound'
                };
                const highestBidFromRound: string = this.getContractData(arg);

                if(highestBidFromRound !== 'loading') {
                    const utils = this.drizzleInstance.web3.utils;
                    return utils.fromWei(highestBidFromRound, 'ether');
                } else {
                    return -1;
                }
            }
            return -1;
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
