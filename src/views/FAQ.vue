<template>
    <div class="container text-medium">


        <h1 class="mb-4">FAQ</h1>


        <FAQContainer>
            <template v-slot:header>
                What is this project about?
            </template>
            <template v-slot:body>
                <p><a href="//twistedsister.io">twistedsister.io</a> explores the forces behind the phenomena of
                    self-portrayal in the network of social media relationships. The project aims to develop an artwork
                    of interconnected tangible and intangible artefacts by leveraging digital technologies. The <a
                            href="//twistedsister.io">twistedsister.io</a> dApp allows users to participate in a
                    coopetitive, economically and aesthetically incentivised experiment of generative art. </p>
            </template>
        </FAQContainer>


        <FAQContainer>
            <template v-slot:header>
                How does this work?
            </template>
            <template v-slot:body>
                <p>During the genesis auction starting on 2 November 2019, 9:00 am CET, each day users can bid on the
                    setting of a single given geometric parameter and apply it to a 3D-avatar. The avatar portrays the
                    3D-scanned female body of a real person. We call her twistedsister.</p>
            </template>
        </FAQContainer>


        <FAQContainer>
            <template v-slot:header>
                What am I bidding on?
            </template>
            <template v-slot:body>
                <p>During the genesis auction, users bid on the setting of a geometric parameter which will modify
                    theappearance of twistedsister. The winning bidder will be awarded a unique blockchain token
                    (ERC-721), cryptographically linked to the image of the winning parameter setting. Each bidding
                    round starts with a new adjustable parameter applied to the appearance of twistedsister from the
                    previous round. There will be 21 bidding rounds.</p>
            </template>
        </FAQContainer>


        <FAQContainer>
            <template v-slot:header>
                What is the duration of the genesis auction?
            </template>
            <template v-slot:body>
                <p>The auction starts on 2 November 2019, 9:00 am CET and ends on 22 November 2019, 9:00 pm CET.
                    Auction rounds start each day at 9:00 am CET and end at 9:00 pm CET the same day. During each
                    bidding window, twistedsister needs time to regenerate and recover from the inflicted distortion
                    pains. Each day a unique adjustable geometric parameter will be auctioned. A total of 21
                    tokens will be issued, one per day.</p>
            </template>
        </FAQContainer>


        <FAQContainer>
            <template v-slot:header>
                What happens after the genesis auction?
            </template>
            <template v-slot:body>
                <p>With the end of the genesis auction the appearance of twistedsister is finalized and all tokens will have been distributed. Holding a <a href="https://etherscan.io/token/0x62acB9A3eCDC880Dc8AB6DFD6cF48CA07ed10De4">TWIST</a> token represents a tamperproof certificate of participation in and ownership of a limited-edition artwork. A total of 21 <a href="https://etherscan.io/token/0x62acB9A3eCDC880Dc8AB6DFD6cF48CA07ed10De4">TWIST</a> tokens will be issued.</p>
            </template>
        </FAQContainer>


        <FAQContainer>
            <template v-slot:header>
                twistedsister: “What is going to happen with me eventually?”
            </template>
            <template v-slot:body>
                <p>A scaled version of the final 3D-model will be printed by the artists. The resulting statue represents the physical edition of the co-created artwork and is cryptographically linked to a unique ERC-721 token – the <a href="https://etherscan.io/token/0x72cbae31bc03d282bb26595fa9c0c2918a4c0cc7">TWIST3D</a> token. In January 2020 the artists will sell the statue on behalf of the <a href="https://etherscan.io/token/0x62acB9A3eCDC880Dc8AB6DFD6cF48CA07ed10De4">TWIST</a> token holders. After the sale <a href="https://etherscan.io/token/0x62acB9A3eCDC880Dc8AB6DFD6cF48CA07ed10De4">TWIST</a> and <a href="https://etherscan.io/token/0x72cbae31bc03d282bb26595fa9c0c2918a4c0cc7">TWIST3D</a> token holders will be able to trade their items.</p>
            </template>
        </FAQContainer>


        <FAQContainer>
            <template v-slot:header>
                What can I do with my tokens?
            </template>
            <template v-slot:body>
                <p><a href="https://etherscan.io/token/0x62acB9A3eCDC880Dc8AB6DFD6cF48CA07ed10De4">TWIST</a> token holders can trade their items on the twistedsister.io marketplace. The 3D-model will be made available for download for everyone to play with, to copy, to print. The <a href="https://etherscan.io/token/0x72cbae31bc03d282bb26595fa9c0c2918a4c0cc7">TWIST3D</a> token holder is the only legitimate owner of the physical edition of twistedsister. </p>
            </template>
        </FAQContainer>


        <FAQContainer>
            <template v-slot:header>
                Do I need an Ethereum address to interact?
            </template>
            <template v-slot:body>
                <p>Yes, you do. We use smart contracts on the Ethereum blockchain to prove ownership, provenance and
                    authenticity of each token as well as for automatic funds allocation. On a computer use Brave,
                    Firefox or Chrome, install the free <a href="https://metamask.io" target="_blank">MetaMask</a>
                    wallet extension and load it with some Ether. MetaMask will take care of your bids and interactions
                    with the blockchain. If you prefer smartphones, you can install Web3-enabled dApp browsers such as
                    Trust wallet, Coinbase wallet, or Rainbow wallet – all freely available for iOS and Android.</p>
            </template>
        </FAQContainer>


        <FAQContainer>
            <template v-slot:header>
                Automated funds distribution, say what?
            </template>
            <template v-slot:body>
                <p>The twistedsister.io marketplace has been devised with a fair future value attribution in mind. For each sale of a <a href="https://etherscan.io/token/0x62acB9A3eCDC880Dc8AB6DFD6cF48CA07ed10De4">TWIST</a> token, 20% of the money will equally be split among the <a href="https://etherscan.io/token/0x62acB9A3eCDC880Dc8AB6DFD6cF48CA07ed10De4">TWIST</a> token holders, and 10% will equally be split among the artists.</p>
            </template>
        </FAQContainer>


    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import FAQContainer from '@/components/FAQContainer.vue';

    export default Vue.extend({
        components: {FAQContainer},
        name: "faqs"
    });
</script>

<style scoped>
    .faq-container {
        margin-left: auto;
        margin-right: auto;
    }

    .faq-header {
        font-weight: bold;
        border-top: 1px solid #ddd;
        /*border-bottom: 1px solid #ddd;*/
        padding-top: .5rem;
        padding-bottom: .5rem;
    }

    .faq-body {
        margin-bottom: 3rem;
    }
</style>
