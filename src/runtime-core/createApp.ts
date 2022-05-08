import { render } from './render'
import { createVNode } from './VNode'

export function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            const vNode = createVNode(rootComponent)
            render(vNode, rootContainer)
        },
    }
}
