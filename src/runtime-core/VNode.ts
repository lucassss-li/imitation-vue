export function createVNode(type, props?, children?) {
    const vNode = {
        type,
        props,
        children,
        el: null,
    }
    return vNode
}
