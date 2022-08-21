import tracker from "../utils/tracker";
import onLoad from "../utils/onLoad";

export function userAction() {
    getIP()
    onLoad(() => {
        console.log(returnCitySN["cip"])
        tracker.send({
            kind: "userAction",
            type: "pv",
            IP:returnCitySN["cip"],
            startTime: Date.now(),
            pageURL: window.location.href,
            referrer: document.referrer,
        });
        if (!localStorage.getItem('IP') ||
            Date.now() - Number(localStorage.getItem('IP')) >= 86400000) {
            localStorage.setItem('IP', Date.now().toString())
            tracker.send({
                kind: "userAction",
                type: "uv",
                IP:returnCitySN["cip"],
                startTime: Date.now(),
                pageURL: window.location.href,
                referrer: document.referrer,

            });
        }

    })
    let startTime = Date.now();
    window.addEventListener(
        "beforeunload",
        () => {
            let duration = (Date.now() - startTime).toFixed(3);
            tracker.send({
                kind: "userAction",
                type: "duration",
                startTime,
                IP:localStorage.getItem('IP'),
                duration,
                pageURL: window.location.href,
            })
        },
        false
    );
    function getIP() {
        let IPScript = document.createElement('script')
        IPScript.src = 'http://pv.sohu.com/cityjson?ie=utf-8'
        document.head.append(IPScript)
    }
}
