<template>
    <div class="previous-auction-container">
        <div class="header-container">
            <span class="round-counter">
                #{{roundNo}} / {{totalRounds}}
            </span>
            <span class="header">
                Passed Auction
            </span>
        </div>
        <div class="content-container">
            <div class="img-container">
                <img src="http://twistedsister.root-lvl.com/contents/auction-03/03-63.jpg" alt=""/>
            </div>
            <div class="details-container">
                <div class="details-container-row">
                    <span class="row-label">ENDED</span>
                    <br/>
                    <span class="row-value">
                        {{roundEndDay}}
                        <br/>
                        {{roundEndTime}}
                    </span>
                </div>
                <div class="details-container-row">
                    <span class="row-label">OWNER</span>
                    <br/>
                    <span class="row-value">
                        {{highestBidder}}
                    </span>
                </div>
                <div class="details-container-row">
                    <span class="row-label">BID</span>
                    <br/>
                    <span class="row-value">
                        {{highestBid}} ETH
                    </span>
                </div>
                <div class="details-container-row">
                    <a :href="etherscanTokenUrl">→ view token on etherscan</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { mapGetters } from 'vuex';
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component({
        computed: mapGetters(['contractName', 'totalRounds', 'roundEnd'])
    })
    export default class PreviousAuction extends Vue {
        @Prop({ required: true })
        roundNo!: number;
        roundEnd: any;

        get roundEndDay() {
            return this.roundEnd(this.roundNo).format('DD MMMM YYYY');
        }

        get roundEndTime() {
            return this.roundEnd(this.roundNo).format('hh:mma');
        }

        get highestBidder() {
            return '0xdffcd8a37f074e7eafae618c986ff825666198bd'
        }

        get highestBid() {
            return '0.05';
        }

        get etherscanTokenUrl() {
            return 'https://etherscan.io/token/0xbc5370374fe08d699cf7fcd2e625a93bf393ccc4?a=909';
        }
    }
</script>

<style scoped>
    .previous-auction-container {
        margin-top: 9rem;
    }

    .header-container {
        border-top: 1px solid #343a40;
        margin-bottom: 3rem;
    }

    .content-container {
        text-align: center;
    }

    .round-counter {
        font-size: 4.5rem;
        font-weight: 400;
        line-height: 1.25;
    }

    .header {
        position: absolute;
        right: 0;
        font-size: 2.5rem;
        font-weight: 500;
        line-height: 1.25;
    }

    .details-container {
        margin: 3rem 0;
    }

    .details-container-row {
        margin-bottom: 1rem;
    }

    .row-label {
        text-transform: uppercase;
        letter-spacing: .2em;
        font-size: 80%;
        font-weight: 500;
    }

    .row-value {
        font-size: 1.25rem;
        font-weight: 600;
    }
</style>