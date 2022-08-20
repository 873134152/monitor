import tracker from "../utils/tracker";
import onLoad from "../utils/onLoad";

export function userAction() {
    getIP()
    onLoad(() => {
        // console.log(returnCitySN["cip"])
        tracker.send({
            kind: "userAction",
            type: "pv",
            startTime: performance.now(),
            pageURL: window.location.href,
            referrer: document.referrer,
        });
        if (!localStorage.getItem('IP') ||
            Date.now() - Number(localStorage.getItem('IP')) >= 86400000) {
            tracker.send({
                kind: "userAction",
                type: "uv",
                startTime: performance.now(),
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
            let duration = Date.now() - startTime;
            tracker.send({
                kind: "userAction",
                type: "duration",
                duration,
                pageURL: window.location.href,
            });
        },
        false
    );
    function getIP() {
        let IPScript = document.createElement('script')
        IPScript.src = 'http://pv.sohu.com/cityjson?ie=utf-8'
        document.head.append(IPScript)
    }
}
