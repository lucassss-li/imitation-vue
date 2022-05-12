import { getCurrentInstance } from './component'

export function provide(key, value) {
    const instance = getCurrentInstance()
    if (instance) {
        const { provides } = instance
        provides[key] = value
    }
}

export function inject(key, defaultValue) {
    const instance = getCurrentInstance()
    if (instance) {
        const parentProvide = instance.parent.provides
        if (parentProvide[key]) {
            return parentProvide[key]
        } else {
            return typeof defaultValue === 'function'
                ? defaultValue()
                : defaultValue
        }
    }
}
