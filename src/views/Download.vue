<template>
    <div class="container">

        <div class="ModelView mb-4">
            <div class="sketchfab-embed-wrapper">
                <iframe title="A 3D model" width="100%" height="100%" src="https://sketchfab.com/models/84e52fa69d3f4f8993e492d170133dde/embed" frameborder="0" allow="autoplay; fullscreen; vr" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
            </div>
        </div>

        <div>
            <p class="text-medium"><a href="https://ipfs.io/ipfs/QmbRqakXKPWn1Z8yznr3GkMeWgsdbHZuZSBymEk262ssVn">Download 3D Model (IPFS)</a></p>
            <p>After downloading, rename the file to "<i>TS3D.stl</i>". You are free to 3D print the model yourself.</p>
        </div>

    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    export default Vue.extend({
        name: "download"
    });
</script>

<style scoped>
    .ModelView{
        padding-top: 56.25%;
        position: relative;
    }
    .sketchfab-embed-wrapper{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
</style>
