import { ShapeFlags } from '../shared/ShapeFlag'
import { createComponentInstance, setupComponent } from './component'
import { Fragment, Text, createTextVNode } from './VNode'

export function render(vNode, container) {
    patch(vNode, container, null)
}

function patch(vNode, container, parentComponent) {
    const { type, shapeFlag } = vNode
    switch (type) {
        case Text: {
            processText(vNode, container)
            break
        }
        case Fragment: {
            processFragment(vNode, container, parentComponent)
            break
        }
        default: {
            if (shapeFlag & ShapeFlags.ELEMENT) {
                processElement(vNode, container, parentComponent)
            } else {
                processComponent(vNode, container, parentComponent)
            }
        }
    }
}

function processFragment(vNode, container, parentComponent) {
    mountChildren(vNode, container, parentComponent)
}

function processText(vNode, container) {
    const { value } = vNode
    const textNode = document.createTextNode(value)
    container.append(textNode)
}

function processElement(vNode, container, parentComponent) {
    mountElement(vNode, container, parentComponent)
}

function mountElement(vNode, container, parentComponent) {
    const { type, props } = vNode
    const element = (vNode.el = document.createElement(type))
    props && processAttribute(props, element)
    mountChildren(vNode, element, parentComponent)
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

function mountChildren(vNode, container, parentComponent) {
    const children: any[] = []
    if (vNode.shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        children.push(vNode.children)
    } else if (vNode.shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        children.push(...vNode.children)
    }
    children.forEach(child => {
        if (!child.shapeFlag) {
            child = createTextVNode(child)
        }
        patch(child, container, parentComponent)
    })
}

function processComponent(vNode, container, parentComponent) {
    mountComponent(vNode, container, parentComponent)
}

function mountComponent(vNode, container, parentComponent) {
    const instance = createComponentInstance(vNode, parentComponent)
    setupComponent(instance)
    setupRenderEffect(instance, container, vNode)
}
function setupRenderEffect(instance, container, vNode) {
    const { proxy } = instance
    const subTree = instance.render.call(proxy)
    patch(subTree, container, instance)
    vNode.el = subTree.el
}
