<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import HelloWorld from './components/HelloWorld.vue'
import { useStore } from './store/index.js'
import { storeToRefs } from 'pinia'
const store = useStore();
console.log(store);

</script>

<template>
<h1>hello</h1>
<h2>{{ store.name }}</h2>
</template>

<style scoped>
</style>
