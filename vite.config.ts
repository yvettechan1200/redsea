import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // 1. 先讀取環境變數
  const env = loadEnv(mode, process.cwd(), '');

  // 2. 回傳完整的設定物件
  return {
    // --- 關鍵設定開始 ---
    plugins: [react()],
    base: "/red-sea/",  // ⚠️ 注意：根據你的截圖，倉庫名有橫線，這裡必須要有！
    // --- 關鍵設定結束 ---

    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'), // 通常建議指到 src
      }
    }
  };
});
