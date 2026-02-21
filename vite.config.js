import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    proxy: {
      '/api': 'http://ec2-16-112-64-187.ap-south-2.compute.amazonaws.com:8080',
      '/uploads': 'http://ec2-16-112-64-187.ap-south-2.compute.amazonaws.com:8080',
    },
  },
})
