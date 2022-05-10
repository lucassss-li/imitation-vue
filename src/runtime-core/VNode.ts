import { ShapeFlags } from '../shared/ShapeFlag'

export function createVNode(type, props?, children?) {
    const vNode = {
        type,
        props,
        children,
        el: null,
        shapeFlag: getShapeFlag(type),
    }
    if (typeof children === 'string') {
        vNode.shapeFlag |= ShapeFlags.TEXT_CHILDREN
    } else {
        vNode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN
    }
    return vNode
}

function getShapeFlag(type) {
    return typeof type === 'string'
        ? ShapeFlags.ELEMENT
        : ShapeFlags.STATEFUL_COMPONENT
}
