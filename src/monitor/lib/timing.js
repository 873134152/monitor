import onLoad from "../utils/onLoad";
import tracker from "../utils/tracker";
import getLastEvent from "../utils/getLastEvent";
import getSelector from "../utils/getSelector";

export function timing() {
    let FMP, LCP
    // 增加一个性能条目的观察者
    new PerformanceObserver((entryList, observer) => {
        const perfEntries = entryList.getEntries();
        FMP = perfEntries[0];
        observer.disconnect(); // 不再观察了
    }).observe({ entryTypes: ["element"] }); // 观察页面中有意义的元素
    // 增加一个性能条目的观察者
    new PerformanceObserver((entryList, observer) => {
        const perfEntries = entryList.getEntries();
        LCP = perfEntries[perfEntries.length - 1];
        observer.disconnect(); // 不再观察了
    }).observe({ entryTypes: ["largest-contentful-paint"] }); // 观察页面中最大的元素
    // 增加交互处理时间
    new PerformanceObserver((entryList, observer) => {
        const lastEvent = getLastEvent();
        const firstInput = entryList.getEntries()[0];
        if (firstInput) {
            // 开始处理的时间 - 开始点击的时间，差值就是处理的延迟
            let inputDelay = firstInput.processingStart - firstInput.startTime;
            let duration = firstInput.duration; // 处理的耗时
            if (inputDelay > 0 || duration > 0) {
                tracker.send({
                    kind: "experience", // 用户体验指标
                    type: "firstInputDelay", // 首次输入延迟
                    inputDelay: inputDelay, // 延迟的时间
                    duration: duration,
                    startTime: firstInput.startTime, // 开始处理的时间
                    selector: lastEvent
                        ? getSelector(lastEvent.path || lastEvent.target)
                        : "",
                });
            }
        }
        observer.disconnect(); // 不再观察了
    }).observe({ type: "first-input", buffered: true }); // 第一次交互

    onLoad(function () {
        console.log(returnCitySN["cip"])
        setTimeout(() => {
            const [entry] = performance.getEntriesByType("navigation"); //获取Nagation实例
            const timingJson = entry.toJSON();//转JSON 读取部分不可读属性
            const {
                fetchStart, // 开始获取文档
                domainLookupStart, // 开始域名解析
                domainLookupEnd, // 结束域名解析
                connectStart, // 开始TCP连接
                connectEnd, // TCP连接结束
                requestStart, // 开始Request连接
                responseStart, // Request连接结束
                responseEnd, // 开始Response
                unloadEventEnd, // Response结束
                domInteractive, // DOM解析结束
                domComplete, // DOM准备结束
                domContentLoadedEventStart, // DOMContentLoaded 开始
                domContentLoadedEventEnd, // DOMContentLoaded 结束
                loadEventStart, // load 结束
            } = timingJson;
            let FP = performance.getEntriesByName('first-paint')[0]
            let FCP = performance.getEntriesByName('first-contentful-paint')[0]

            tracker.send({
                kind: "experience",
                type: "timing",
                DNSTime: (domainLookupEnd - domainLookupStart).toFixed(3), // DNS time
                connectTime: (connectEnd - connectStart).toFixed(3), //TCP连接耗时
                ttfbTime: (responseStart - requestStart).toFixed(3), //Time to First Byte
                responseTime: (responseEnd - responseStart).toFixed(3), //Response响应耗时
                parseDOMTime: (loadEventStart - unloadEventEnd).toFixed(3), //DOM解析渲染耗时
                DOMReady: domComplete.toFixed(3), //DOM ready
                domContentLoadedTime: (domContentLoadedEventEnd - domContentLoadedEventStart).toFixed(3), //DOMContentLoaded事件回调耗时
                timeToInteractive: (domInteractive - fetchStart).toFixed(3), //首次可交互时间
                loadTime: (loadEventStart - fetchStart).toFixed(3), //完整的加载时间
                firstPaint: FP ? FP.startTime.toFixed(3) : 0, // FirstPaint 第一次绘制
                firstContentPaint: FCP ? FCP.startTime.toFixed(3) : 0, // FirstContentPaint 第一次HTML内容绘制
                firstMeaningfulPaint: FMP ? FMP.startTime.toFixed(3) : 0, // FirstMeaningfulPaint 第一次有意义内容绘制
                largestContentfulPaint: LCP ? (LCP.renderTime || LCP.loadTime).toFixed(3) : 0 // largestContentfulPaint 最大元素绘制
            });
            // tracker.send({
            //     kind: "experience",
            //     type: "paint",
            //     firstPaint: FP ? FP.startTime : 0,
            //     firstContentPaint: FCP ? FCP.startTime : 0,
            //     firstMeaningfulPaint: FMP ? FMP.startTime : 0,
            //     largestContentfulPaint: LCP ? (LCP.renderTime || LCP.loadTime) : 0
            // });

        }, 3000);

    });
}
