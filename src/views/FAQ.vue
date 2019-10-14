<template>
    <div class="container text-medium">
    	
    	
    	<h1 class="mb-4">FAQ</h1>

    	<FAQContainer>
    		<template v-slot:header>
    			What is this project about?
    		</template>
    		<template v-slot:body>
					<p>The twistedsister.io project aims to develop an artwork of interconnected tangible and intangible artifacts by leveraging digital technologies. The eponymous dApp allows users to participate in a coopetitive, economically and aesthetically incentivised project of generative art.</p>
    		</template>
    	</FAQContainer>

    	<FAQContainer>
    		<template v-slot:header>
    			What is this project about?</span>
    		</template>
    		<template v-slot:body>
    			<p>The twistedsister.io project aims to develop an artwork of interconnected tangible and intangible artifacts by leveraging digital technologies. The eponymous dApp allows users to participate in a coopetitive, economically and aesthetically incentivised project of generative art.</p>
    		</template>
    	</FAQContainer>


    	<FAQContainer>
    		<template v-slot:header>
    			How does this work?</span>
    		</template>
    		<template v-slot:body>
    			<p>During the genesis auction starting on 2 November 2019, 9:00 am CET, each day users can bid on the setting of a single given geometric parameter and apply it to the 3d-avatar of human. The avatar portrays the 3d-scanned female body of a real person. We call her twistedsister.</p>
    		</template>
    	</FAQContainer>



    	<FAQContainer>
    		<template v-slot:header>
    			What am I bidding on?</span>
    		</template>
    		<template v-slot:body>
    			<p>During the genesis auction, users bid on the setting of a geometric parameter which will modify the appearance of twistedsister. The winning bidder will be awarded a unique blockchain token (ERC-721), cryptographically linked to the image file of the winning parameter setting. Each bidding round starts with a new adjustable parameter applied to the appearance of twistedsister from the previous round. There will be 21 bidding rounds.</p>
    		</template>
    	</FAQContainer>



    	<FAQContainer>
    		<template v-slot:header>
    			What is the duration of the genesis auction?</span>
    		</template>
    		<template v-slot:body>
    			<p>The auction starts on 2 November 2019, 9:00 am CET and ends on 22 November 2019, 9:00 pm CET. Auction rounds start each day at 9:00 am CET and end at 9:00 pm CET the same day. During that time twistedsister needs time to regenerate and recover from the inflicted distortion pains. Each day a unique adjustable geometric parameter will be auctioned. A total of 21 tokens will be issued, one per day.</p>
    		</template>
    	</FAQContainer>



    	<FAQContainer>
    		<template v-slot:header>
    			What happens after the genesis auction?</span>
    		</template>
    		<template v-slot:body>
    			<p>With the end of the genesis auction the appearance of twistedsister is finalized and all tokens have been distributed. Holding a TWIST token represents a tamperproof certificate of participation in and ownership of a limited-edition artwork. A total of 21 TWIST tokens will be issued. Each token is numbered. TWIST token holders will have the right to access, view and download the jointly modified avatar of twistedsister.</p>
    		</template>
    	</FAQContainer>



    	<FAQContainer>
    		<template v-slot:header>
    				twistedsister: “What is going to happen with me eventually?”
    		</template>
    		<template v-slot:body>
    			<p>A scaled version of the final 3d-model will be 3d-printed by the artists. The resulting statue represents the unique physical edition of the artwork and will cryptographically be linked to a single ERC-721 token, the TWIST3D token. In a one-off IRL exhibition in January 2020, the artists reserve the right to present, perform and eventually sell the statue on behalf of the TWIST token holders. Once the sale is confirmed on the blockchain, TWIST and TWIST3D token holders will be able to access, view and download the twistedsister 3d-model.</p>
    		</template>
    	</FAQContainer>



    	<FAQContainer>
    		<template v-slot:header>
    			What can I do with my tokens?</span>
    		</template>
    		<template v-slot:body>
    			<p>TWIST token holders can sell, trade and transfer their digital items with other users directly or on secondary marketplaces such as opensea.io. The TWIST3D token holder is the legitimate owner of the unique physical edition of twistedsister, while the TWIST token owners are its stakeholders. In order to maintain the link between the physical and the digital realm, it is the TWIST3D token holder’s responsibility to transact any IRL change of ownership of the statue (sell, trade, transfer) by using the smart contract address printed at the bottom of the statue’s base. The same responsibility applies to vice-versa transactions.</p>
    		</template>
    	</FAQContainer>



    	<FAQContainer>
    		<template v-slot:header>
    			Do I need an Ethereum address to interact?</span>
    		</template>
    		<template v-slot:body>
    			<p>Yes, you do. We use smart contracts on the Ethereum blockchain to prove ownership, provenance and authenticity of each token as well as for automatic funds allocation. On a computer use Brave, Firefox or Chrome, install the free MetaMask wallet extension and load it with some Ether. MetaMask will take care of your bids and interactions with the blockchain. If you prefer smartphones, you can install Web3-enabled dApp browsers such as Trust wallet, Coinbase wallet, or Rainbow wallet – all freely available for iOS and Android.</p>
    		</template>
    	</FAQContainer>



    	<FAQContainer>
    		<template v-slot:header>
    			Automated funds distribution, say what?</span>
    		</template>
    		<template v-slot:body>
    			<p>Open blockchains facilitate permissionless, secure, near instant peer-to-peer value transactions without an intermediary. Automated funds distribution via smart contracts is a central part of the twistedsister.io project. It allows a thoughtful value chain design. In secondary market sales 20% of a transaction will equally be distributed among the token holders, while 10% will be equally distributed among the artists – forever…</p>
    		</template>
    	</FAQContainer>



    	<FAQContainer>
    		<template v-slot:header>
    			Who is behind Twistedsister?</span>
    		</template>
    		<template v-slot:body>
    			<p>We are a temporary collective of artists and designers investigating the potentials of digital technologies and their impact on cultural production. Twistedsister is Armin Blasbichler, Brigitte Fässler, Martina Graf, Julian Humm and Matthias Pfäffli.</p>
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
	.faq-container{
		margin-left: auto;
		margin-right: auto;
	}
	.faq-header{
		font-weight: bold;
		border-top: 1px solid #ddd;
		/*border-bottom: 1px solid #ddd;*/
		padding-top: .5rem;
		padding-bottom: .5rem;
	}
	.faq-body{
		margin-bottom: 3rem;
	}
</style>