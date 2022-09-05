<script setup lang="ts">
import { isDev, toggleDev } from '@/composables/index'
import MineBlock from '@/components/MineBlock.vue'
import { GamePlay } from '@/composables/logic'
import { useStorage } from '@vueuse/core'
import confetti from '@/components/confetti.vue'
let play = new GamePlay(9, 9, 1)
//持久化
useStorage('gameState', play.state)
const state = computed(() => play.blockBoard)
watchEffect(() => {
  play.checkGameState()
})
</script>
<template>
  <div> 
   <div class="title">
     <h2>扫雷</h2> 
    <div>炸弹个数：{{ play.mines }}</div>
    <!-- <div>{{ gameState }}</div> -->
    <button @click="toggleDev()">{{ isDev }}</button>
    <button @click="play.reset()">reset</button>
   </div>
    <div class="horizon" v-for="(row, y) in state" :key="y">
          <MineBlock v-for="(block, x) in row" :key="x" 
          :block="block"  
          @click="play.onClick(block)"  
          @contextmenu.prevent="play.rightClick(block)"
          ></MineBlock>
        </div>
  </div>  
  <confetti :passed="play.state.value.gameState == 'win' ? true : false"></confetti>
</template>
<style scoped lang="less">
.horizon {
  display: flex;
  overflow: auto;
}
</style>