<script setup lang="ts">
import { isDev, toggleDev } from '@/composables/index'
import MineBlock from '@/components/MineBlock.vue'
import { GamePlay } from '@/composables/logic'
import { useStorage } from '@vueuse/core'

let play = new GamePlay(10, 10)
useStorage('gameState', play.state)
const state = computed(() => play.blockBoard)

watch(play.state.value.blockBoard, () => {
  play.checkGameState()
}, {
  deep: true
})
</script>
<template>
  <div> 
    <h2>扫雷</h2> 
    <!-- <div>{{ gameState }}</div> -->
    <button @click="toggleDev()">{{ isDev }}</button>
    <button @click="play.reset()">reset</button>
    <div class="horizon" v-for="(row, y) in state" :key="y">
          <MineBlock v-for="(block, x) in row" :key="x" 
          :block="block"  
          @click="play.onClick(block)"  
          @contextmenu.prevent="play.rightClick(block)"
          ></MineBlock>
        </div>
  </div>
</template>
<style scoped lang="less">
.horizon {
  display: flex;
}
</style>