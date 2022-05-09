import { createComponentInstance, setupComponent } from './component'

export function render(vNode, container) {
    patch(vNode, container)
}

function patch(vNode, container) {
    if (typeof vNode === 'string') {
        container.append(vNode)
    } else if (typeof vNode.type === 'string') {
        processElement(vNode, container)
    } else {
        processComponent(vNode, container)
    }
}

function processElement(vNode, container) {
    mountElement(vNode, container)
}

function mountElement(vNode, container) {
    const { type, props, children } = vNode
    const element = (vNode.el = document.createElement(type))
    props && processAttribute(props, element)
    children && mountChildren(children, element)
    container.append(element)
}

function processAttribute(props, element) {
    //TODO:处理属性
    for (const key in props) {
        if (key === 'class') {
            element.classList.add(...props[key])
        }
        if (key === 'style') {
            for (const field in props[key]) {
                element.style.setProperty(field, props[key][field])
            }
        }
    }
}

function mountChildren(children, container) {
    if (Array.isArray(children)) {
        children.forEach(child => patch(child, container))
    } else {
        patch(children, container)
    }
}

function processComponent(vNode, container) {
    mountComponent(vNode, container)
}

function mountComponent(vNode, container) {
    const instance = createComponentInstance(vNode)
    setupComponent(instance)
    setupRenderEffect(instance, container, vNode)
}
function setupRenderEffect(instance, container, vNode) {
    const { proxy } = instance
    const subTree = instance.render.call(proxy)
    patch(subTree, container)
    vNode.el = subTree.el
}
