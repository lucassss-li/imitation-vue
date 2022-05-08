export function createComponentInstance(vNode) {
    const component = {
        vNode,
        type: vNode.type,
    }
    return component
}

export function setupComponent(instance) {
    //TODO:initProps()
    //TODO:initSlots()
    setupStatefulComponent(instance)
}
function setupStatefulComponent(instance: any) {
    const component = instance.type
    const { setup } = component
    if (setup) {
        const setupResult = setup()
        handleSetupResult(instance, setupResult)
    }
}
function handleSetupResult(instance, setupResult: any) {
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult
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
