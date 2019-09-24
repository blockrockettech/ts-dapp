<template>
    <div class="previous-auction-container">
        <div class="header-container">
            <span class="round-counter">
                #{{roundNo}} / 21
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
                        12 November 2019
                        <br/>
                        08:00pm
                    </span>
                </div>
                <div class="details-container-row">
                    <span class="row-label">OWNER</span>
                    <br/>
                    <span class="row-value">
                        0xd12cd8a37f074e7eafae618c986ff825666198bd
                    </span>
                </div>
                <div class="details-container-row">
                    <span class="row-label">BID</span>
                    <br/>
                    <span class="row-value">
                        0.025 ETH
                    </span>
                </div>
                <div class="details-container-row">
                    <a>→ view token on etherscan</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component({})
    export default class PreviousAuction extends Vue {
        @Prop({ required: true })
        auctionContractName!: string;

        @Prop({ required: true })
        roundNo!: number;
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