import { effect } from '../index'
import { ShapeFlags } from '../shared/ShapeFlag'
import { createComponentInstance, setupComponent } from './component'
import { Fragment, Text, createTextVNode } from './VNode'

export function render(vNode, container) {
    patch(null, vNode, container, null, null)
}

function patch(n1, n2, container, parentComponent, anchor) {
    const { type, shapeFlag } = n2
    switch (type) {
        case Text: {
            processText(n1, n2, container)
            break
        }
        case Fragment: {
            processFragment(n1, n2, container, parentComponent, anchor)
            break
        }
        default: {
            if (shapeFlag & ShapeFlags.ELEMENT) {
                processElement(n1, n2, container, parentComponent, anchor)
            } else {
                processComponent(n1, n2, container, parentComponent, anchor)
            }
        }
    }
}

function processFragment(n1, n2, container, parentComponent, anchor) {
    mountChildren(n2, container, parentComponent, anchor)
}

function processText(n1, n2, container) {
    const { value } = n2
    const textNode = document.createTextNode(value)
    container.append(textNode)
}

function processElement(n1, n2, container, parentComponent, anchor) {
    if (!n1) {
        mountElement(n2, container, parentComponent, anchor)
    } else {
        patchElement(n1, n2, parentComponent, anchor)
    }
}

function patchElement(n1, n2, parentComponent, anchor) {
    const oldProps = n1.props || {}
    const newProps = n2.props || {}
    const el = (n2.el = n1.el)
    patchProps(oldProps, newProps, el)
    patchChildren(n1, n2, el, parentComponent, anchor)
}

function patchChildren(n1, n2, container, parentComponent, anchor) {
    const preShapeFlag = n1.shapeFlag
    const shapeFlag = n2.shapeFlag
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        if (preShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
            unmountChildren(container)
        }
        if (n1.children !== n2.children) {
            setElementText(container, n2.children)
        }
    } else {
        if (preShapeFlag & ShapeFlags.TEXT_CHILDREN) {
            unmountChildren(container)
            mountChildren(n2, container, parentComponent, anchor)
        } else {
            patchKeyedChildren(
                n1.children,
                n2.children,
                container,
                parentComponent,
                anchor,
            )
        }
    }
}

function isSameVNodeType(n1, n2) {
    return n1.type === n2.type && n1.key === n2.key
}

function patchKeyedChildren(c1, c2, container, parentComponent, parentAnchor) {
    let i = 0
    let e1 = c1.length - 1
    let e2 = c2.length - 1
    //对比左侧
    while (i <= e1 && i <= e2) {
        const n1 = c1[i]
        const n2 = c2[i]
        if (isSameVNodeType(n1, n2)) {
            patch(n1, n2, container, parentComponent, parentAnchor)
        } else {
            break
        }
        i++
    }
    //对比右侧
    while (i <= e1 && i <= e2) {
        const n1 = c1[e1]
        const n2 = c2[e2]
        if (isSameVNodeType(n1, n2)) {
            patch(n1, n2, container, parentComponent, parentAnchor)
        } else {
            break
        }
        e1--
        e2--
    }
    //新的比老的长 创建
    if (i > e1) {
        if (i <= e2) {
            const nextPos = e2 + 1
            const anchor = nextPos < c2.length ? c2[nextPos].el : null
            while (i <= e2) {
                patch(null, c2[i], container, parentComponent, anchor)
                i++
            }
        }
    } else if (i > e2) {
        //新的比老的短 删除
        while (i <= e1) {
            c1[i].el.remove()
            i++
        }
    } else {
        //处理中间节点
        const s1 = i
        const s2 = i
        const toBePatch = e2 - i + 1
        let patched = 0
        const keyToNewIndexMap = new Map()
        const newIndexToOldIndxMap = Array(toBePatch).fill(0)

        for (let i = s2; i <= e2; i++) {
            keyToNewIndexMap.set(c2[i].key, i)
        }
        for (let i = s1; i <= e1; i++) {
            const preChild = c1[i]
            if (patched === toBePatch) {
                preChild.el.remove()
                continue
            }
            let newIndex
            if (preChild.key !== null) {
                newIndex = keyToNewIndexMap.get(preChild.key)
            } else {
                for (let j = s2; j <= e2; j++) {
                    if (isSameVNodeType(preChild, c2[j])) {
                        newIndex = j
                        break
                    }
                }
            }
            if (newIndex === undefined) {
                preChild.el.remove()
            } else {
                newIndexToOldIndxMap[newIndex - s2] = i + 1
                patch(preChild, c2[newIndex], container, parentComponent, null)
                patched++
            }
        }
        const increasingNewIndexSequence = getSequence(newIndexToOldIndxMap)
        let j = increasingNewIndexSequence.length - 1
        for (let i = toBePatch - 1; i >= 0; i--) {
            const nextIndex = i + s2
            const nextChild = c2[nextIndex]
            const anchor =
                nextIndex + 1 < c2.length ? c2[nextIndex + 1].el : null
            if (newIndexToOldIndxMap[i] === 0) {
                patch(null, nextChild, container, parentComponent, anchor)
            } else if (i !== increasingNewIndexSequence[j]) {
                container.insertBefore(nextChild.el, anchor)
            } else {
                j++
            }
        }
    }
}

function unmountChildren(container) {
    ;[...container.childNodes].forEach(node => {
        container.removeChild(node)
    })
}
function setElementText(el, text) {
    el.textContent = text
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

function mountElement(vNode, container, parentComponent, anchor) {
    const { type, props } = vNode
    const element = (vNode.el = document.createElement(type))
    props && mountProps(props, element)
    mountChildren(vNode, element, parentComponent, anchor)
    container.insertBefore(element, anchor)
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

function mountChildren(vNode, container, parentComponent, anchor) {
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
        patch(null, child, container, parentComponent, anchor)
    })
}

function processComponent(n1, n2, container, parentComponent, anchor) {
    mountComponent(n2, container, parentComponent, anchor)
}

function mountComponent(vNode, container, parentComponent, anchor) {
    const instance = createComponentInstance(vNode, parentComponent)
    setupComponent(instance)
    setupRenderEffect(instance, container, vNode, anchor)
}
function setupRenderEffect(instance, container, vNode, anchor) {
    effect(() => {
        if (!instance.mounted) {
            const { proxy } = instance
            const subTree = (instance.subTree = instance.render.call(proxy))
            patch(null, subTree, container, instance, anchor)
            vNode.el = subTree.el
            instance.mounted = true
        } else {
            const { proxy } = instance
            const preTree = instance.subTree
            const subTree = (instance.subTree = instance.render.call(proxy))
            patch(preTree, subTree, container, instance, anchor)
            vNode.el = subTree.el
        }
    })
}

function getSequence(arr: number[]): number[] {
    const p = arr.slice()
    const result = [0]
    let i, j, u, v, c
    const len = arr.length
    for (i = 0; i < len; i++) {
        const arrI = arr[i]
        if (arrI !== 0) {
            j = result[result.length - 1]
            if (arr[j] < arrI) {
                p[i] = j
                result.push(i)
                continue
            }
            u = 0
            v = result.length - 1
            while (u < v) {
                c = (u + v) >> 1
                if (arr[result[c]] < arrI) {
                    u = c + 1
                } else {
                    v = c
                }
            }
            if (arrI < arr[result[u]]) {
                if (u > 0) {
                    p[i] = result[u - 1]
                }
                result[u] = i
            }
        }
    }
    u = result.length
    v = result[u - 1]
    while (u-- > 0) {
        result[u] = v
        v = p[v]
    }
    return result
}
