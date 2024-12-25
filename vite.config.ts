import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv'

export default defineConfig(({ mode }) => {
  const envFile = `.env-${mode}`
  const envConfig = dotenv.parse(fs.readFileSync(envFile))
  
  for (const k in envConfig) {
    process.env[k] = envConfig[k]
  }

  return {
    plugins: [vue()],
    base: '/WSD-OAUTH/',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    define: {
      __APP_IP__: JSON.stringify(process.env.IP_ADDRESS),
      __APP_PORT__: JSON.stringify(process.env.PORT),
      __APP_TMDB_API_KEY__: JSON.stringify(process.env.TMDB_API_KEY),
      __APP_REDIRECT_URL__: JSON.stringify(process.env.APP_REDIRECT_URL),
      __APP_KAKAO_CLIENT_ID__: JSON.stringify(process.env.APP_KAKAO_CLIENT_ID),
    }
  }
})