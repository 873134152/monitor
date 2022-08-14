import tracker from "../utils/tracker";
import onLoad from "../utils/onLoad";
const getSelector = (element) => {
    let selector
    if (element.id) {
        selector = `#${element.id}`
    } else if (element.className && typeof element.className === "string") {
        selector =
            "." +
            element.className
                .split(" ")
                .filter(function (item) {
                    return !!item
                })
                .join(".")
    } else {
        selector = element.nodeName.toLowerCase()
    }
    return selector
}
export function whiteScreen() {
    const wrapperSelectors = ["body", "html", "#container", ".content"];
    let emptyPoints = 0;
    const isWrapper = (element) => {
        let selector = getSelector(element);
        if (wrapperSelectors.indexOf(selector) >= 0) {
            emptyPoints++
        }
    }
    onLoad(function () {
        let xElements, yElements,acElements;
        for (let i = 1; i <= 9; i++) {
            xElements = document.elementsFromPoint(
                (window.innerWidth * i) / 10,
                window.innerHeight / 2
            );
            yElements = document.elementsFromPoint(
                window.innerWidth / 2,
                (window.innerHeight * i) / 10
            );
            acElements = document.elementsFromPoint(
                (window.innerWidth * i) / 10,
                (window.innerHeight * i) / 10
            );
            isWrapper(xElements[0])
            isWrapper(yElements[0])
            isWrapper(acElements[0])
        }
        if (emptyPoints >= 20) {
            let centerElements = document.elementsFromPoint(
                window.innerWidth / 2,
                window.innerHeight / 2
            );
            tracker.send({
                kind: "stability",
                type: "error",
                errorType: "whiteScreenError",
                emptyPoints: "" + emptyPoints,
                screen: window.screen.width + "x" + window.screen.height,
                viewPoint: window.innerWidth + "x" + window.innerHeight,
                selector: getSelector(centerElements[0]),
            });
        }
    });
}
