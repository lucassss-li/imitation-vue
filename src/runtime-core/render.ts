import { ShapeFlags } from '../shared/ShapeFlag'
import { createComponentInstance, setupComponent } from './component'

export function render(vNode, container) {
    patch(vNode, container)
}

function patch(vNode, container) {
    if (vNode.shapeFlag & ShapeFlags.ELEMENT) {
        processElement(vNode, container)
    } else {
        processComponent(vNode, container)
    }
}

function processElement(vNode, container) {
    mountElement(vNode, container)
}

function mountElement(vNode, container) {
    const { type, props } = vNode
    const element = (vNode.el = document.createElement(type))
    props && processAttribute(props, element)
    mountChildren(vNode, element)
    container.append(element)
}

function processAttribute(props, element) {
    for (const key in props) {
        if (key === 'class') {
            element.classList.add(...props[key])
        }
        if (key === 'style') {
            for (const field in props[key]) {
                element.style.setProperty(field, props[key][field])
            }
        }
        if (/^on[A-Z]/.test(key)) {
            const event = key.slice(2).toLowerCase()
            element.addEventListener(event, props[key])
        }
    }
}

function mountChildren(vNode, container) {
    const children: any[] = []
    if (vNode.shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        children.push(vNode.children)
    } else if (vNode.shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        children.push(...vNode.children)
    }
    children.forEach(child => {
        if (typeof child === 'string') {
            container.append(child)
        } else {
            patch(child, container)
        }
    })
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
