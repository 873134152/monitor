import userAgent from "user-agent";
import {postUrl} from "../index";
const getUserLocalData = () => {
    // console.log(location);
    return {
        title: document.title,
        url: location.href,
        timestamp: Date.now(),
        userAgent: userAgent.parse(navigator.userAgent)
    }
}

class SendTracker {
    constructor() {
        this.url = window.postUrl ? window.postUrl : 'http://106.55.171.246/api/post_err'
        this.url = 'http://106.55.171.246/api/post_err'; //后台接口
        // this.url = 'http://prevention.purplesun.top/user/post'
    }
    send(data = {}) {
        this.xhr = new XMLHttpRequest()
        let userLocalData = getUserLocalData()
        // console.log(userLocalData);
        let log = {...userLocalData, ...data}
        this.xhr.open('POST', this.url, true)
        log = JSON.stringify(log)

        this.xhr.setRequestHeader('Content-Type', 'application/json')
        this.xhr.onload = () => {
            // console.log('res',this.xhr.response)
        }
        this.xhr.onerror = (error) => {
            console.log('error',error);
        }
        this.xhr.send(log)
        console.log('log',JSON.parse(log));
    }

}

export default new SendTracker()
