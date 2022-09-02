<script setup lang="ts">
// 地雷状态
interface BlockState {
  x?: number,
  y?: number,
  // 是否翻开
  revealed: boolean,
  //是不是炸弹
  mine?: boolean,
  //旗子
  flag?: boolean,
  //附近的雷的个数
  adjacentMines: number
}
// 地雷盘的大小
const HEIGHT = 10;
const WIDTH = 10;
//格子状态
const state = reactive(
  Array.from({ length: HEIGHT }, (_, y) =>
    Array.from({ length: WIDTH }, (_, x): BlockState => ({ x, y, adjacentMines: 0, revealed: false })
    )))

//格子的方位
const directions = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [1, 1], [0, 1], [-1, 1]
]
// 数字颜色
const numberColors = [
  'transparent',
  'green',
  'yellow',
  'red',
  'skyblue',
  'pink'
]


// console.log(state);

// 生成炸弹
// 要对第一次点击的格子进行判断
function generateMines(initalItem: BlockState) {
  for (let row of state) {
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
  state.forEach((row, y) => {
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
    return state[y2][x2]
  }).filter(Boolean)
}

// let getMineClass = computed((item) => {
//   if (item.mine) {
//     return { isMine: true }
//   }
// })
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
function hoverClass(item: BlockState) {
  if (item.flag) return
  if (!item.revealed) {
    return {
      hoverClass: true
    }
  }
}

//开发环境
let dev = true

let mineGenerate = false

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

function rightClick(item: BlockState) {
  if (item.revealed) return
  item.flag = !item.flag
}

</script>
<template>
  <div>
    <h2>扫雷</h2>
    <div class="horizon" v-for="(row, y) in state" :key="y">
          <div  v-for="(item, x) in row" :key="x" :class="hoverClass(item)">
            <div class="grid" :style="getGridClass(item)"  @click="onClick(item)"  @contextmenu.prevent="rightClick(item)">
          <template v-if="item.revealed" >
            <div v-if="item.mine" class="iconfont icon-baozha"></div>
            <div v-else>{{ item.adjacentMines }}</div>
          </template>
          <template v-else>
            <div v-if="item.flag" class="iconfont icon-qizi flag"></div>
          </template>
        </div> 
          </div>
    </div>
  </div>
</template>
<style scoped lang="less">
.grid {
  width: 40px;
  height: 40px;
  border: 1px solid rgba(162, 165, 165, 0.347);
  text-align: center;
  line-height: 40px;
  font-size: 18px;
  font-weight: 800;
  margin: 1px;

  // &:hover {
  //   background-color: rgba(212, 215, 215, 0.1);
  //   // background-color: red;
  // }
}

.horizon {
  display: flex;

}

.isMine {
  background-color: rgba(250, 129, 129, 0.5);
}

.icon-baozha {
  font-size: 35px;
  color: rgba(136, 120, 115, 0.895);
}

.flag {
  // background-color: transparent;
  font-size: 25px;
  color: lightsalmon;
}

.hoverClass:hover {
  background-color: rgba(212, 215, 215, 0.6);
}
</style>