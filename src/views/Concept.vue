<template>
    <div class="container">
      <video 
        src="/contents/loop.mp4" 
        type="video/mp4" 
        autoplay
        loop
        muted
        playsinline
        class="mb-6 d-block mx-auto mw-100 w-auto h-auto"
        >
        Your browser does not support the video tag.
      </video>
      <p class="text-large">TWISTED SISTER operates at the intersection of art, technology and economy. The project explores our self-portrayal in the network of social media relationships. Photography and film, 3D animation and 3D printing, blockchain and performance conflate into a complete work which gravitates around the human body as a malleable avatar. Over a period of 21 days, 21 parameters will be auctioned off every day to determine the final shape of the avatar. Buyers become co-creators and co-owners alike. By presenting and selling the resulting artistic artefacts on analog and digital marketplaces, the viewer is invited to rethink the nature of his virtual self.</p>
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