import {injectJSError} from "./lib/JSError";
import {injectXHR} from "./lib/XHRError";
import {whiteScreen} from "./lib/whiteScreenError";
import {timing} from "./lib/timing";
import {userAction} from "./lib/userAction";

injectJSError()
injectXHR()
whiteScreen()
timing()
userAction()
// localStorage.removeItem('IP')
window.setOption = function (option = {}) {
    window.postUrl = option.url
}
