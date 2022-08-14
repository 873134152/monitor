# monitor
## 项目目标
+ 监控JSError，接口Error，资源Error，白屏等稳定性问题
+ 监控FP、FCP、FMP等渲染指标，有利于提高前端渲染优化
+ 监控PV、UV、页面停留时间统计网站流量
## 手段
### 1. 稳定性
  + addEventListener('error')进行JSError监听、ResourceError监听
  + addEventListener('unhandledrejection')进行PromiseError监听
  + 利用elementsFromPoint(x, y) 对选取点进行HTML判断，若为根节点则可能为空白
  + 重写XMLRequest方法，对网站请求数据进行日志反馈
### 2. 渲染优化
   + 利用PerformanceObserver统计FMP、LCP、FID
   + 利用performance.getEntriesByName统计FP、FCP
   + 利用performance.getEntriesByType("navigation")获取navigation实例并JSON化，获取浏览器渲染时间
