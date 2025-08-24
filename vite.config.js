import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        manualChunks: {
          // 将第三方库分离到单独的 chunk
          vendor: ['firebase'],
          // 将路由相关代码分离
          router: ['./src/router/index.js'],
          // 将组件分离
          components: [
            './src/components_fn/positionSelector/positionSelector.js',
            './src/components_fn/sidebar/sidebar.js',
            './src/components_fn/imgCarousel/imgCarousel.js'
          ]
        }
      }
    },
    // 启用 CSS 代码分割
    cssCodeSplit: true,
    // 设置 chunk 大小警告限制
    chunkSizeWarningLimit: 1000
  },
  server: {
    port: 3000,
    open: true,
    // 启用热更新
    hmr: true
  },
  // 优化依赖预构建
  optimizeDeps: {
    include: ['firebase']
  },
  // CSS 预处理
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "src/scss/abstracts/variables" as *; @use "src/scss/abstracts/mixins" as mixins;`
      }
    }
  },
  // 别名配置
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components_fn'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@styles': resolve(__dirname, 'src/scss')
    }
  }
});
