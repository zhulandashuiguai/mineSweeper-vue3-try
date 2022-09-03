// 地雷状态
export interface BlockState {
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