import {injectJSError} from "./lib/JSError";
import {injectXHR} from "./lib/XHRError";
import {whiteScreen} from "./lib/whiteScreenError";
import {timing} from "./lib/timing";

injectJSError()
injectXHR()
whiteScreen()
timing()
