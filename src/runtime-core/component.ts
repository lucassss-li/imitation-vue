import { proxyRef } from '../reactivity/index'
import { emit } from './componentEmit'
import { initProps } from './componentProps'
import { publicInstanceProxyHandlers } from './componentPublicInstance'
import { initSlots } from './componentSlots'

export function createComponentInstance(vNode, parentComponent) {
    console.log(parentComponent)
    const component = {
        vNode,
        type: vNode.type,
        setupState: {},
        props: {},
        // eslint-disable-next-line
        emit: event => {},
        slots: {},
        provides: parentComponent
            ? Object.create(parentComponent.provides)
            : {},
        parent: parentComponent,
        mounted: false,
        subTree: null,
    }
    component.emit = emit.bind(null, component)
    return component
}

export function setupComponent(instance) {
    initProps(instance, instance.vNode.props)
    initSlots(instance, instance.vNode.children)
    setupStatefulComponent(instance)
}
function setupStatefulComponent(instance: any) {
    const component = instance.type
    instance.proxy = new Proxy({ _: instance }, publicInstanceProxyHandlers)
    const { setup } = component
    if (setup) {
        setCurrentInstance(instance)
        const setupResult = setup(instance.props, { emit: instance.emit })
        setCurrentInstance(null)
        handleSetupResult(instance, setupResult)
    }
}
function handleSetupResult(instance, setupResult: any) {
    if (typeof setupResult === 'object') {
        instance.setupState = proxyRef(setupResult)
    } else {
        // TODO:function
    }
    finishComponentSetup(instance)
}
function finishComponentSetup(instance: any) {
    const component = instance.type
    if (component.render) {
        instance.render = component.render
    }
}

let currentInstance
export function getCurrentInstance() {
    return currentInstance
}
function setCurrentInstance(instance) {
    currentInstance = instance
}
