const getSelectors = (path) => {
    return path.reverse().filter(element => {
        return element !== document && element !== window
    }).map(element => {
        if (element.id) {
            return `${element.nodeName.toLowerCase()}#${element.id}`
        } else if (element.className && typeof element.className === 'string') {
            return `${element.nodeName.toLowerCase()}.${element.className}`
        } else {
            return element.nodeName.toLowerCase()
        }
    }).join(' ')
}
export default function (path) {
    if (Array.isArray(path)) {
        return getSelectors(path)
    } else {
        let totalArray = []
        while (path) {
            totalArray.push(path)
            path = path.parentNode
        }
        return getSelectors(totalArray)
    }
}
