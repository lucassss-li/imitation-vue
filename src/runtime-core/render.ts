import { effect } from '../index'
import { ShapeFlags } from '../shared/ShapeFlag'
import { createComponentInstance, setupComponent } from './component'
import { Fragment, Text, createTextVNode } from './VNode'

export function render(vNode, container) {
    patch(null, vNode, container, null)
}

function patch(n1, n2, container, parentComponent) {
    const { type, shapeFlag } = n2
    switch (type) {
        case Text: {
            processText(n1, n2, container)
            break
        }
        case Fragment: {
            processFragment(n1, n2, container, parentComponent)
            break
        }
        default: {
            if (shapeFlag & ShapeFlags.ELEMENT) {
                processElement(n1, n2, container, parentComponent)
            } else {
                processComponent(n1, n2, container, parentComponent)
            }
        }
    }
}

function processFragment(n1, n2, container, parentComponent) {
    mountChildren(n2, container, parentComponent)
}

function processText(n1, n2, container) {
    const { value } = n2
    const textNode = document.createTextNode(value)
    container.append(textNode)
}

function processElement(n1, n2, container, parentComponent) {
    if (!n1) {
        mountElement(n2, container, parentComponent)
    } else {
        patchElement(n1, n2)
    }
}

function patchElement(n1, n2) {
    const oldProps = n1.props || {}
    const newProps = n2.props || {}
    const el = (n2.el = n1.el)
    patchProps(oldProps, newProps, el)
}

function patchProps(oldProps, newProps, element) {
    for (const key in newProps) {
        const preProp = oldProps[key]
        const nextProp = newProps[key]
        if (preProp !== nextProp) {
            patchProp(key, nextProp, element)
        }
    }
    for (const key in oldProps) {
        if (!(key in newProps)) {
            element.removeAttribute(key)
        }
    }
}

function mountElement(vNode, container, parentComponent) {
    const { type, props } = vNode
    const element = (vNode.el = document.createElement(type))
    props && mountProps(props, element)
    mountChildren(vNode, element, parentComponent)
    container.append(element)
}

function mountProps(props, element) {
    for (const key in props) {
        patchProp(key, props[key], element)
    }
}

function patchProp(key, value, element) {
    if (value === undefined || value === null) {
        element.removeAttribute(key)
        return
    }
    if (key === 'class') {
        element.classList.add(...value)
    } else if (key === 'style') {
        for (const field in value) {
            element.style.setProperty(field, value[field])
        }
    } else if (/^on[A-Z]/.test(key)) {
        const event = key.slice(2).toLowerCase()
        element.addEventListener(event, value)
    } else {
        element.setAttribute(key, value)
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
        if (typeof child !== 'object') {
            child = createTextVNode(child)
        }
        patch(null, child, container, parentComponent)
    })
}

function processComponent(n1, n2, container, parentComponent) {
    mountComponent(n2, container, parentComponent)
}

function mountComponent(vNode, container, parentComponent) {
    const instance = createComponentInstance(vNode, parentComponent)
    setupComponent(instance)
    setupRenderEffect(instance, container, vNode)
}
function setupRenderEffect(instance, container, vNode) {
    effect(() => {
        if (!instance.mounted) {
            const { proxy } = instance
            const subTree = (instance.subTree = instance.render.call(proxy))
            patch(null, subTree, container, instance)
            vNode.el = subTree.el
            instance.mounted = true
        } else {
            const { proxy } = instance
            const preTree = instance.subTree
            const subTree = (instance.subTree = instance.render.call(proxy))
            patch(preTree, subTree, container, instance)
            vNode.el = subTree.el
        }
    })
}
