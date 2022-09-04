import { BlockState } from '@/types'
import { Ref } from 'vue'
//格子的方位
const directions = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [1, 1], [0, 1], [-1, 1]
]

// 游戏状态管理
interface GameState {
  //扫雷棋盘 
  blockBoard: BlockState[][],
  // 是否生成炸弹
  mineGenerate: boolean,
  //
  gameState: 'play' | 'win' | 'lose'
}


export class GamePlay {
  //游戏状态
  state = ref() as Ref<GameState>
  constructor(public width: number, public height: number) {
    // watch(state, () => { checkGameState() }, { deep: true })
    this.reset()
    // 地雷盘的大小
    this.width = width
    this.height = height
  }
  // 重置游戏
  reset() {
    this.state.value = {
      gameState: 'play',
      mineGenerate: false,
      blockBoard: Array.from({ length: this.height }, (_, y) =>
        Array.from({ length: this.width }, (_, x): BlockState => ({ x, y, adjacentMines: 0, revealed: false })))
    }
  }
  get blockBoard() {
    return this.state.value.blockBoard
  }

  // 生成炸弹
  // 要对第一次点击的格子进行判断
  generateMines(state: BlockState[][], initalItem: BlockState) {
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
    this.updateNumbers()
  }

  // 计算每个格子周围的炸弹
  updateNumbers() {
    this.blockBoard.forEach((row) => {
      row.forEach((block) => {
        // 是炸弹就return
        if (block.mine) return
        //计算炸弹数量
        this.getSiblings(block).forEach(b => {
          if (b.mine) {
            block.adjacentMines += 1
          }
        })
      })
    })
  }

  // <!--获取格子周围的八个格子 -->
  getSiblings(block: BlockState) {
    //返回一个数组，包含点击节点周围的8个节点(除去越界的),
    return directions.map(([dx, dy]) => {
      const x2 = block.x + dx
      const y2 = block.y + dy
      if (x2 < 0 || x2 >= this.width || y2 >= this.height || y2 < 0) return undefined
      // if (state[y2][x2].mine) { block.adjacentMines += 1 }
      return this.blockBoard[y2][x2]
    }).filter(Boolean)
  }


  //开发环境




  //点击事件
  onClick(item: BlockState) {
    if (this.state.value.gameState !== 'play') return
    if (item.flag) return
    // console.log(item);
    if (!this.state.value.mineGenerate) {
      // 生成炸弹
      this.generateMines(this.blockBoard, item)
      this.state.value.mineGenerate = true
    }
    this.expendZero(item)
    item.revealed = true
    // console.log(getSiblings(item));
    // checkGameState()
    if (item.mine) {
      this.state.value.gameState = 'lose'
      this.showAllMines()
      alert('you lost!')
    }

  }

  //初始点击时，如果是0，展开0和附近的东西，
  expendZero(block: BlockState) {
    let adjacents = this.getSiblings(block)
    // 如果点击的item附近炸弹数不是0，就直接return
    if (block.adjacentMines !== 0) return
    // 如果是0，0的周围一定都不是炸弹，就把他们翻开
    adjacents.forEach((s) => {
      if (!s.revealed) {
        s.revealed = true
        this.expendZero(s)
      }
    })
  }
  // 鼠标右键事件
  rightClick(item: BlockState) {
    if (this.state.value.gameState !== 'play') return
    if (item.revealed || !this.state.value.mineGenerate) return
    item.flag = !item.flag
    // checkGameState()
  }

  //显示所有炸弹
  showAllMines() {
    let allBlocks = this.blockBoard.flat()
    allBlocks.filter((s) => s.mine).forEach(x => { x.revealed = true })
  }

  // 检测游戏状态
  checkGameState() {
    if (!this.state.value.mineGenerate) return
    let blocks = this.blockBoard.flat()
    // 胜利条件：遍历所有的方格，统计被点开的方格数量+用户确认雷的数量等于所有方格的数量那么就认为玩家获胜了。
    let revealedAll = 0
    let flagedAll = 0
    let mineNum = 0
    let revealedNum = 0
    blocks.forEach(x => {
      if (x.revealed) revealedAll++
      if (x.flag) flagedAll++
      if (x.mine) mineNum++
      if (x.revealed) revealedNum++
    })
    if (this.state.value.gameState == 'lose') return

    if (revealedAll + flagedAll == blocks.length || revealedNum + mineNum == blocks.length) {
      this.state.value.gameState = 'win'
      setTimeout(() => { alert('you win') }, 50)
    }
  }
}