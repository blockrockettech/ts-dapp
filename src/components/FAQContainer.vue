<template>
	<div class="faq-container">
		<div class="faq-header row" v-on:click="open = !open">
			<span class="col-11 text-left"><slot name="header" /></span>
			<span class="col-1 text-right" v-if="open">–</span>
			<span class="col-1 text-right" v-else>+</span>
		</div>
		<div class="faq-body fliesstext" v-bind:class="{ open: open }">
			<slot name="body" />
		</div>
	</div>
</template>

<script lang="ts">
	import Vue from 'vue'
	import Component from 'vue-class-component'
	@Component({})
	export default class FAQContainer extends Vue {
	  open: boolean = false;
	 }
</script>

<style scoped>
	.faq-container{
		margin-left: auto;
		margin-right: auto;
	}
	.faq-header{
		font-weight: bold;
		border-top: 1px solid #ddd;
		padding-top: .5rem;
		padding-bottom: .5rem;
		cursor: pointer;
	}
	.faq-header:hover{
		background: #f9f9f9;
	}
	.faq-body{
		display: none;
		margin-bottom: 3rem;
	}
	.faq-body.open{
		display: block;
	}
</style>