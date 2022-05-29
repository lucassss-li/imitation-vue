const publicPropertiesMap = {
    $el: i => i.vNode.el,
    $slots: i => i.slots,
    $props: i => i.props,
}

export const publicInstanceProxyHandlers = {
    get({ _: instance }, key) {
        const { setupState, props } = instance
        if (key in setupState) {
            return setupState[key]
        } else if (key in props) {
            return props[key]
        }
        const publicGetter = publicPropertiesMap[key]
        if (publicGetter) {
            return publicGetter(instance)
        }
    },
    set({ _: instance }, key, value) {
        const { setupState, props } = instance
        if (key in setupState) {
            return (setupState[key] = value)
        } else if (key in props) {
            return (props[key] = value)
        }
    },
}
