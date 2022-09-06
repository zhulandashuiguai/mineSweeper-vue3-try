<template>
  <el-drawer
    v-model="drawerVisible"
    :direction="direction"
    title="玩法介绍"
    :before-close="handleClose"
  >
    <div class="content">
      <div class="text">点击任意方块开始扫雷</div>
      <div class="text">方块中的<strong>数字</strong>代表周围地雷的<strong>个数</strong></div>
      <div class="text">游戏开始后使用<strong>鼠标右键</strong>可以在你认为是地雷的格子里<strong>标旗</strong><span class="iconfont icon-qizi flag"></span></div>
      <div class="text">当点开所有不是地雷的格子后，或者用旗子标完全部的地雷后即可获胜</div>
    </div>
  </el-drawer>

  

</template>

<script lang="ts" setup>
defineProps({
  drawerVisible:Boolean
})

const direction = ref('rtl')

const handleClose = (done: () => void) => {
      done()
}

</script>
<style lang="less">
.el-drawer__header {
  // align-items: center;
  color: #72767b;
  display: flex;
  margin-bottom: 0px !important;
  padding: var(--el-drawer-padding-primary);
  padding-bottom: 0;
}

.text {
  margin: 5px 0;
}
</style>