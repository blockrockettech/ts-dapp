<template>
    <div class="container">

        <h5>EN</h5>
        <div class="embed-responsive embed-responsive-16by9 mb-5">
            <iframe
                    src="https://player.vimeo.com/video/383586346"
                    width="640"
                    height="360"
                    frameborder="0"
                    allow="autoplay;
                    fullscreen"
                    allowfullscreen
            />
        </div>

        <h5>DE</h5>
        <div class="embed-responsive embed-responsive-16by9 mb-5 ">
            <iframe
                    src="https://player.vimeo.com/video/401900274"
                    width="640"
                    height="360"
                    frameborder="0"
                    allow="autoplay; fullscreen"
                    allowfullscreen
            />
        </div>


        <p class="text-large">
            <a href="http://twistedsister.io/content/twistedsister.io_Projektdokumentation.pdf">Download Documentation (DE)</a>
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