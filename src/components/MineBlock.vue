<script setup lang="ts">
import { BlockState } from '@/types'
import { isDev } from '@/composables/index'
defineProps<{ block: BlockState }>()

// 数字颜色
const numberColors = [
  'transparent',
  'green',
  'yellow',
  'red',
  'skyblue',
  'pink'
]

//hover样式
function hoverClass(item: BlockState) {
  if (item.flag) return
  if (!item.revealed) {
    return {
      hoverClass: true
    }
  }
}
//格子炸弹和普通格子的样式
function getGridClass(item: BlockState) {
  // 如果没有翻开
  if (!item.revealed) {
    return {
      backgroundColor: 'rgba(107,114,128,0.1)'
    }
  } else {//翻开之后 是雷还是数字
    if (item.mine) {
      return {
        backgroundColor: 'rgba(250, 108, 108, 0.653)'
      }
    } else {
      return {
        color: numberColors[item.adjacentMines]
      }
    }
  }
}
</script>

<template>
  <div :class="hoverClass(block)">
            <div class="grid" :style="getGridClass(block)" >
          <template v-if="block.revealed || isDev" >
            <div v-if="block.mine" class="iconfont icon-baozha"></div>
            <div v-else>{{ block.adjacentMines }}</div>
          </template>
          <template v-else>
            <div v-if="block.flag" class="iconfont icon-qizi flag"></div>
          </template>
        </div> 
      </div>
</template>

<style scoped>
.hoverClass:hover {
  background-color: rgba(212, 215, 215, 0.6);
}

.grid {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 32px;
  min-height: 32px;
  border: 1px solid rgba(162, 165, 165, 0.347);
  text-align: center;
  /* line-height: 32px; */

  font-size: 16px;
  font-weight: 700;
  margin: 1px;
}

.flag {
  /* // background-color: transparent; */
  font-size: 20px;
  color: lightsalmon;
}

.isMine {
  background-color: rgba(250, 129, 129, 0.5);
}

.icon-baozha {
  font-size: 25px;
  color: rgba(136, 120, 115, 0.895);
}
</style>