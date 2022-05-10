import { createVNode } from './VNode'

export function renderSlots(slots, name = 'default') {
    const slot = slots[name]
    return slot ? createVNode('div', {}, slots[name]) : ''
}
