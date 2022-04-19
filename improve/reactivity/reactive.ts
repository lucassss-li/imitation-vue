import { isObject } from '../shared'
import { mutableHandlers } from './baseHandlers'

export const enum ReactiveFlags {
    SKIP = '__v_skip',
    IS_REACTIVE = '__v_isReactive',
    IS_READONLY = '__v_isReadonly',
    IS_SHALLOW = '__v_isShallow',
    RAW = '__v_raw',
}

export interface Target {
    [ReactiveFlags.SKIP]?: boolean
    [ReactiveFlags.IS_REACTIVE]?: boolean
    [ReactiveFlags.IS_READONLY]?: boolean
    [ReactiveFlags.IS_SHALLOW]?: boolean
    [ReactiveFlags.RAW]?: any
}

export const reactiveMap = new WeakMap<object, any>()

export function reactive<T extends object>(target: T): { [K in keyof T]: T[K] }
export function reactive(target: Target) {
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

export const isReactive = (val: unknown) => {
    return !!(isObject(val) && (val as Target)[ReactiveFlags.IS_REACTIVE])
}
