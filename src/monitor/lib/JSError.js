import getLastEvent from "../utils/getLastEvent";
import getSelector from "../utils/getSelector";
import tracker from "../utils/tracker";
export function injectJSError() {
    //监听全局捕获错误
    window.addEventListener('error', (event) => {
        // console.log(event)
        let lastEvent = getLastEvent() //最后一个交互事件
        let log
        if (event.target && (event.target.src || event.target.href)) {
            log = {
                kind: 'stability',
                type: 'error',
                errorType: 'resourceError',
                message: 'Could not found resource',
                filename: event.target.src || event.target.href,
                tagName: event.target.tagName,
                timeStamp: event.timeStamp,
                selector: getSelector(event.target)
            }
        } else {
            log = {
                kind: 'stability',
                type: 'error',
                errorType: 'jsError',
                message: event.message,
                filename: event.filename,
                position: `rows:${event.lineno} columns:${event.colno}`,
                stack: getLines(event.error.stack),
                selector: lastEvent ? getSelector(lastEvent.path) : ''
            }
        }
        tracker.send(log)
    }, true)
    //监听Promise错误
    window.addEventListener('unhandledrejection', (event) => {
        console.log(event);
        let lastEvent = getLastEvent()
        let reason = event.reason
        let log = {
            kind: 'stability',
            type: 'error',
            errorType: 'PromiseError',
            message: event.message,
            filename: '',
            position: '',
            stack: '',
            selector: lastEvent ? getSelector(lastEvent.path) : ''
        }
        if (typeof reason === 'string') {
            log.message = reason
        } else if (typeof reason === 'object') {
            if (reason.stack) {
                let matchResult = reason.stack.match(/at\s+(.+):(\d+):(\d+)/)
                log.filename = matchResult[1]
                log.position = `rows:${matchResult[2]} columns:${matchResult[3]}`
            }
            log.stack = getLines(reason.stack)
            log.message = reason.message
        }
        tracker.send(log)
    })

    //获取优化操作堆栈
    const getLines = (stack) => {
        return stack.split('\n').splice(1).map(
            item => {
                return item.replace(/^\s+at\s+/g,'')
            }
        ).join('^')
    }
}
