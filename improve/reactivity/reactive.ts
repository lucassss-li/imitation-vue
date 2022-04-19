import { isObject } from '../shared'
import { mutableHandlers } from './baseHandlers'

export const reactiveMap = new WeakMap<object, any>()

export function reactive<T extends object>(target: T): { [K in keyof T]: T[K] }
export function reactive(target) {
    if (!isObject(target)) {
        console.warn('target is not a object')
        return
    }
    let proxy = reactiveMap.get(target)
    if (proxy) {
        return proxy
    }
    proxy = new Proxy(target, mutableHandlers)
    reactiveMap.set(target, proxy)
    return proxy
}
