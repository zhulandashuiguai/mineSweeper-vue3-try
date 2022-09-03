<script setup lang="ts">
import { BlockState } from '@/types'
import { isDev, toggleDev } from '@/composables/index'
import MineBlock from '@/components/MineBlock.vue'
// 地雷盘的大小
const HEIGHT = 5;
const WIDTH = 5;
//格子状态
let state = ref(
  Array.from({ length: HEIGHT }, (_, y) =>
    Array.from({ length: WIDTH }, (_, x): BlockState => ({ x, y, adjacentMines: 0, revealed: false })
    )))

//格子的方位
const directions = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [1, 1], [0, 1], [-1, 1]
]


// console.log(state);

// 生成炸弹
// 要对第一次点击的格子进行判断
function generateMines(initalItem: BlockState) {
  for (let row of state.value) {
    for (let block of row) {
      //让第一次点击时周围不出现炸弹
      if (Math.abs(initalItem.x - block.x) <= 1)
        continue
      if (Math.abs(initalItem.y - block.y) <= 1)
        continue

      block.mine = Math.random() < 0.3
    }
  }
  //检测格子周围炸弹数
  updateNumbers()
}

// 计算每个格子周围的炸弹
function updateNumbers() {
  state.value.forEach((row, y) => {
    row.forEach((block, x) => {
      // 是炸弹就return
      if (block.mine) return
      //计算炸弹数量
      getSiblings(block).forEach(b => {
        if (b.mine) {
          block.adjacentMines += 1
        }
      })
    })
  })
}

// <!--获取格子周围的八个格子 -->
function getSiblings(block: BlockState) {
  //返回一个数组，包含点击节点周围的8个节点(除去越界的),
  return directions.map(([dx, dy]) => {
    const x2 = block.x + dx
    const y2 = block.y + dy
    if (x2 < 0 || x2 >= WIDTH || y2 >= HEIGHT || y2 < 0) return undefined
    // if (state[y2][x2].mine) { block.adjacentMines += 1 }
    return state.value[y2][x2]
  }).filter(Boolean)
}


//开发环境


let mineGenerate = false

// 输了还是赢了
let isLose = ref(false)
//点击事件
function onClick(item: BlockState) {
  if (item.flag) return
  // console.log(item);
  if (!mineGenerate) {
    // 生成炸弹
    generateMines(item)
    mineGenerate = true
  }
  expendZero(item)
  item.revealed = true
  // console.log(getSiblings(item));
  // checkGameState()
  if (item.mine) {
    isLose.value = true;
    alert('you lost!')
  }
}

//初始点击时，如果是0，展开0和附近的东西，
function expendZero(block: BlockState) {
  let adjacents = getSiblings(block)
  // 如果点击的item附近炸弹数不是0，就直接return
  if (block.adjacentMines !== 0) return
  // 如果是0，0的周围一定都不是炸弹，就把他们翻开
  adjacents.forEach((s) => {
    if (!s.revealed) {
      s.revealed = true
      expendZero(s)
    }
  })
}
// 鼠标右键事件
function rightClick(item: BlockState) {
  if (item.revealed || !mineGenerate) return
  item.flag = !item.flag
  // checkGameState()
}

// 检测游戏状态
function checkGameState() {
  if (!mineGenerate) return
  let blocks = state.value.flat()
  // 胜利条件：遍历所有的方格，统计被点开的方格数量+用户确认雷的数量等于所有方格的数量那么就认为玩家获胜了。
  let revealedAll = 0
  let flagedAll = 0
  blocks.forEach(x => {
    if (x.revealed) revealedAll++
    if (x.flag) flagedAll++
  })
  if (isLose.value) return
  if (revealedAll + flagedAll == blocks.length) { setTimeout(() => { alert('you win') }, 50) }
}
watch(state, () => { checkGameState() }, { deep: true })

</script>
<template>
  <div> 
    <h2>扫雷</h2> <button @click="toggleDev()">{{ isDev }}</button>
    <div class="horizon" v-for="(row, y) in state" :key="y">
          <MineBlock v-for="(block, x) in row" :key="x" 
          :block="block"  
          @click="onClick(block)"  
          @contextmenu.prevent="rightClick(block)"
          ></MineBlock>
        </div>
  </div>
</template>
<style scoped lang="less">
.horizon {
  display: flex;

}
</style>