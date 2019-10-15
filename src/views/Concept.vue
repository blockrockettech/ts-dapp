<template>
    <div class="container">
      <video 
        src="https://s3.eu-central-1.amazonaws.com/twistedsister.io/Anitest_defintiv.mov" 
        type="video/mp4" 
        autoplay
        loop
        muted
        playsinline
        class="mb-5 d-block mx-auto mw-100 w-auto h-auto"
        >
        Your browser does not support the video tag.
      </video>
      <p class="text-large">
      	twistedsiter.io operates at the intersection of art, technology and economy. The project explores our self-portrayal in the network of social media relationships. Photography and film, 3D animation and 3D printing, blockchain and performance conflate into a complete work which gravitates around the human body as a malleable avatar.
      </p>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    export default Vue.extend({
        name: "concept"
    });
</script>

<style scoped>

</style>