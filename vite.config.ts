import { defineConfig } from 'vite'
import AutoImport from "unplugin-auto-import/vite"
import vue from '@vitejs/plugin-vue'
import path from 'path'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve('./src') // @代替src
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
  plugins: [vue(),
  AutoImport({
    imports: ["vue", "vue-router"], // 自动导入vue和vue-router相关函数
    dts: "src/auto-import.d.ts" // 生成 `auto-import.d.ts` 全局声明
  }),
  Components({
    resolvers: [ElementPlusResolver()],
  }),
  ]

})
