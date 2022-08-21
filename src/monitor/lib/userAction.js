import tracker from "../utils/tracker";
import onLoad from "../utils/onLoad";

export function userAction() {
    getIP()
    onLoad(() => {
        // console.log(returnCitySN["cip"])
        tracker.send({
            kind: "userAction",
            type: "pv",
            IP:localStorage.getItem('IP'),
            startTime: Date.now(),
            pageURL: window.location.href,
            referrer: document.referrer,
        });
        if (localStorage.getItem('IP') ||
            Date.now() - Number(localStorage.getItem('IP')) >= 86400000) {
            tracker.send({
                kind: "userAction",
                type: "uv",
                IP:localStorage.getItem('IP'),
                startTime: Date.now(),
                pageURL: window.location.href,
                referrer: document.referrer,
            });
            localStorage.setItem('IP', Date.now().toString())
        }

    })
    let startTime = Date.now();
    window.addEventListener(
        "beforeunload",
        () => {
            debugger
            let duration = (Date.now() - startTime).toFixed(3);
            tracker.send({
                kind: "userAction",
                type: "duration",
                startTime,
                IP:localStorage.getItem('IP'),
                duration,
                pageURL: window.location.href,
            })
            debugger;
        },
        false
    );
    function getIP() {
        let IPScript = document.createElement('script')
        IPScript.src = 'http://pv.sohu.com/cityjson?ie=utf-8'
        document.head.append(IPScript)
    }
}
