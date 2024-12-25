import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/WSD-OAUTH/', // GitHub Pages 배포용 base 경로 설정
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
