// 性能监控工具

interface PerformanceMetrics {
  // 页面加载时间
  pageLoadTime: number;
  // 首屏渲染时间
  firstPaint: number;
  // 首次内容渲染时间
  firstContentfulPaint: number;
  // 最大内容渲染时间
  largestContentfulPaint: number;
  // 首次输入延迟
  firstInputDelay: number;
  // 累积布局偏移
  cumulativeLayoutShift: number;
}

// 获取性能指标
export const getPerformanceMetrics = (): Partial<PerformanceMetrics> => {
  const metrics: Partial<PerformanceMetrics> = {};
  
  // 导航计时
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (navigation) {
    metrics.pageLoadTime = navigation.loadEventEnd - navigation.startTime;
  }
  
  //  paint 计时
  const paintEntries = performance.getEntriesByType('paint');
  paintEntries.forEach((entry) => {
    if (entry.name === 'first-paint') {
      metrics.firstPaint = entry.startTime;
    }
    if (entry.name === 'first-contentful-paint') {
      metrics.firstContentfulPaint = entry.startTime;
    }
  });
  
  return metrics;
};

// 监听 LCP
export const observeLCP = (callback: (value: number) => void) => {
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1] as any;
    callback(lastEntry.startTime);
  });
  
  observer.observe({ entryTypes: ['largest-contentful-paint'] });
  
  return () => observer.disconnect();
};

// 监听 CLS
export const observeCLS = (callback: (value: number) => void) => {
  let clsValue = 0;
  
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!(entry as any).hadRecentInput) {
        clsValue += (entry as any).value;
      }
    }
    callback(clsValue);
  });
  
  observer.observe({ entryTypes: ['layout-shift'] });
  
  return () => observer.disconnect();
};

// 监听 FID
export const observeFID = (callback: (value: number) => void) => {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const fid = (entry as any).processingStart - entry.startTime;
      callback(fid);
    }
  });
  
  observer.observe({ entryTypes: ['first-input'] });
  
  return () => observer.disconnect();
};

// 资源加载监控
export const observeResourceLoading = () => {
  const resources = performance.getEntriesByType('resource');
  
  const slowResources = resources.filter((resource) => {
    return resource.duration > 1000; // 超过1秒的资源
  });
  
  if (slowResources.length > 0) {
    console.warn('慢加载资源:', slowResources.map((r) => ({
      name: r.name,
      duration: r.duration,
      type: (r as any).initiatorType,
    })));
  }
  
  return slowResources;
};

// 内存使用监控
export const getMemoryUsage = () => {
  const memory = (performance as any).memory;
  if (memory) {
    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
    };
  }
  return null;
};

// 性能报告
export const reportPerformance = () => {
  const metrics = getPerformanceMetrics();
  const memory = getMemoryUsage();
  
  console.log('📊 性能报告:', {
    ...metrics,
    memory,
    timestamp: new Date().toISOString(),
  });
  
  // 可以在这里发送数据到分析服务
  // sendToAnalytics(metrics);
};

// 初始化性能监控
export const initPerformanceMonitoring = () => {
  // 页面加载完成后报告性能
  window.addEventListener('load', () => {
    setTimeout(reportPerformance, 0);
  });
  
  // 监听 LCP
  observeLCP((value) => {
    console.log('🎨 LCP:', value.toFixed(2), 'ms');
  });
  
  // 监听 CLS
  observeCLS((value) => {
    console.log('📐 CLS:', value.toFixed(4));
  });
  
  // 监听 FID
  observeFID((value) => {
    console.log('⚡ FID:', value.toFixed(2), 'ms');
  });
};

export default {
  getPerformanceMetrics,
  observeLCP,
  observeCLS,
  observeFID,
  observeResourceLoading,
  getMemoryUsage,
  reportPerformance,
  initPerformanceMonitoring,
};
