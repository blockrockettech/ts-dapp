<template>
    <div class="container">
        <video
                src="https://s3.eu-central-1.amazonaws.com/twistedsister.io/twistedsisterio-fysaveasguys.mov"
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
            Merging visual thinking, game theory and value systems as elements of social interaction and collaborative
            creation practices, <a href="//twistedsister.io">twistedsister.io</a> explores the forces behind the
            phenomena of self-portrayal in social media relationships. Digital 3D technologies, visual
            media, blockchain and performance conflate into an artistic work which gravitates around the human body as a
            malleable avatar.
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