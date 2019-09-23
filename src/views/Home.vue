<template>
  <div class="home">
    <Bid />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Bid from '@/components/Bid.vue'; // @ is an alias to /src

export default Vue.extend({
  name: 'home',
  components: {
    Bid,
  },
});
</script>

<style scoped>
  .home {
    padding: 0 35px;
  }
</style>
