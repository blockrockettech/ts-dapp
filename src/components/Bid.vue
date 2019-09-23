<template>
  <div>
    <h1>Auction bid</h1>
    <hr/>
    <form>
      <div>
        <label for="parameter-input">
          Parameter:
          <input id="parameter-input" type="number" v-model="parameter" />
        </label>
      </div>
      <div>
        <label for="bid-amount-input">
          Bid amount:
          <input id="bid-amount-input" type="number" v-model="bid" />
        </label>
      </div>
      <input type="submit"/>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Bid',
  data: () => {
    return {
      parameter: 0,
      bid: 0
    };
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
