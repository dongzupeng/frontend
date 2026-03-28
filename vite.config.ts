import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    // 代码可视化插件
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/stats.html'
    })
  ],
  
  // 构建优化
  build: {
    // 启用代码压缩
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    
    // 代码分割配置
    rollupOptions: {
      output: {
        // 手动代码分割
        manualChunks(id: string) {
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
            return 'react-vendor'
          }
          if (id.includes('react-markdown') || id.includes('remark-gfm') || id.includes('rehype-highlight')) {
            return 'markdown-vendor'
          }
        },
        // 分包配置
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        // 资产文件命名
        assetFileNames(assetInfo) {
          if (!assetInfo.name) return 'assets/[name]-[hash][extname]'
          if (/.+\.(png|jpe?g|gif|svg|webp|ico)$/i.test(assetInfo.name)) {
            return 'assets/images/[name]-[hash][extname]'
          }
          if (/.+\.(css)$/i.test(assetInfo.name)) {
            return 'assets/css/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        },
      },
    },
    // 资源内联限制
    assetsInlineLimit: 4096, // 4KB
    
    // 预渲染配置
    cssCodeSplit: true,
    sourcemap: false,
    
    // 目标浏览器
    target: 'es2015',
  },
  
  // 开发服务器优化
  server: {
    // 热更新优化
    hmr: {
      overlay: false,
    },
  },
  
  // 依赖优化
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'axios',
      'react-markdown',
      'remark-gfm',
      'rehype-highlight',
    ],
    exclude: [],
  },
  
  // 解析配置
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  
  // CSS 优化
  css: {
    devSourcemap: false,
  },
})
