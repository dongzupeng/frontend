import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initPerformanceMonitoring } from './utils/performance.ts'

// 初始化性能监控
if (import.meta.env.MODE === 'development') {
  initPerformanceMonitoring()
}

createRoot(document.getElementById('root')!).render(
    <App />
)
