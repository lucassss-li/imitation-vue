import { createVNode } from './VNode'

export function h(type, props?, children?) {
    return createVNode(type, props, children)
}
