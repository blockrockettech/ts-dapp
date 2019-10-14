<template>
    <div class="container text-medium">
    	
    	
    	<h1 class="mb-4">Disclaimer</h1>

    	<ul class="">
    		
    		<li>
    			<p>
    				A TWIST token represents (i) ownership of co-created limited-edition artwork, (ii) grants access to the   digital 3-model of twistedsister and (iii) it constitutes a stake in any blockchain-recorded sale of the twistedsister statue.
    			</p>
    		</li>

    		<li>
    			<p>
    				The unique TWST3D token represents authentic ownership of the unique twistedsister statue. A person or entity who possesses the statue but not the token or vice-versa cannot claim ownership rights of the actual artifact. The owner of the twistedsister statue must provide proof of holding the TWIST3D token anytime in order to maintain its value proposition. Missing due diligence by the token holder may cause both instances to “fork” off from each other and create their own economy and audience.
    			</p>
    		</li>

    		<li>
    			<p>
    				TWIST and TWST3D token holders are eligible to access, view and download the twistedsister 3d-model file (i) once the auction has ended and (ii) all tokens have been distributed and (iii) the twistedsister statue has been sold.
    			</p>
    		</li>

    		<li>
    			<p>
    				Token owners can sell, trade and transfer their items to other users on NFT marketplaces.
    			</p>
    		</li>

    		<li>
    			<p>
    				Token ownership related to this project does not include copyright claims, ability to produce commercially, create merchandise therefrom, etc.
    			</p>
    		</li>

    		<li>
    			<p>
    				The intellectual property rights remain with the artists.
    			</p>
    		</li>

    		<li>
    			<p>
    				The artist cannot be made liable of technical failures beyond their reach. Also, they cannot guarantee that the array of artworks resulted from the twistedsister.io project and their respective tokens are of and maintain any economic value.
    			</p>
    		</li>

    	</ul>

    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    export default Vue.extend({
        name: "disclaimers"
    });
</script>

<style scoped>
	ul{
		list-style: none;
	}
	li{
		position: relative;
	}
	ul li::before {
	  content: "–"; 
	  font-weight: bold;
	  display: block;
	  position: absolute;
	  width: 1em;
	  margin-left: -1em;
	}
</style>