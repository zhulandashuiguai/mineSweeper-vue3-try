<script setup lang="ts">
import MineBlock from '@/components/MineBlock.vue'
import { GamePlay } from '@/composables/logic'
import { useNow, useStorage } from '@vueuse/core'
import confetti from '@/components/confetti.vue'
let play = new GamePlay(9, 9, 10)
//持久化
useStorage('gameState', play.state)
const state = computed(() => play.blockBoard)
watchEffect(() => {
  play.checkGameState()
})

let now = useNow()
let time = computed(() => {
  return (((+play.state.value.endTime||+now.value) - (+play.state.value.startTime||+now.value)) / 1000).toFixed(0)
})

let mineRest = computed(() => {
  if (!play.state.value.mineGenerate) { return play.mines }
  let mineCount = play.blockBoard.flat().reduce((a, b) => a + (b.mine ? 1 : 0) - (b.flag ? 1 : 0), 0)
  return mineCount
})

let openDrawer = ref(false)


</script>
<template>
  <h3>扫雷</h3> 
  <div> 
    
  <div class="btn">
    <!-- <button class="btn-dev btn-in" @click="toggleDev()">{{ isDev }}</button> -->
    <button class="btn-new btn-in" @click="play.reset()">新游戏</button>
    <button class="btn-in" @click="play.reset(9, 9, 10)">简单</button>
    <button class="btn-in" @click="play.reset(16, 16, 40)">中等</button>
    <button class="btn-in" @click="play.reset(30, 16, 99)">较难</button>
    <button @click="openDrawer=!openDrawer" >游戏规则</button>
  </div>
  <div class="middle">
    <div class="mid"><div class="iconfont icon-line_jishiqi"></div> &nbsp;{{ time }}</div>
    <div class="mid"><div class="iconfont icon-baozha"></div>&nbsp;{{ mineRest }}</div>
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
  <Drawer :drawerVisible="openDrawer"></Drawer>
</template>
<style scoped lang="less">
.horizon {
  display: flex;
  justify-content: center;
}

.btn {
  margin: 18px;

  .btn-in {
    margin: 0 3px;
  }
}

.middle {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
  font-weight: 700;
}

.mid {
  margin: 0 28px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-line_jishiqi {
  font-size: 25px;
  // padding-top: 5px;
}

.icon-baozha {
  font-size: 30px;
}
</style>