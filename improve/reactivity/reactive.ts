import { mutableHandlers } from './baseHandlers'
import { isObject } from '../shared/index'

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

export const reactiveMap = new WeakMap<Target, any>()

export function reactive<T extends object>(target: T): { [K in keyof T]: T[K] }
export function reactive(target: any) {
    return createReactiveObject(target, mutableHandlers)
}

function createReactiveObject(target: Target, baseHandlers: ProxyHandler<any>) {
    if (!isObject(target)) {
        console.warn(`value cannot be made reactive: ${String(target)}`)
        return target
    }
    if (target[ReactiveFlags.RAW]) {
        return target
    }
    let proxy = reactiveMap.get(target)
    if (!proxy) {
        proxy = new Proxy(target, baseHandlers)
        reactiveMap.set(target, proxy)
    }
    return proxy
}

export function isReactive(value: unknown): boolean {
    return !!(<Target>value)[ReactiveFlags.IS_REACTIVE]
}
