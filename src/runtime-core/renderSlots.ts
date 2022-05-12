import { createVNode, Fragment } from './VNode'

export function renderSlots(slots, name = 'default') {
    const slot = slots[name]
    return slot ? createVNode(Fragment, {}, slots[name]) : ''
}
