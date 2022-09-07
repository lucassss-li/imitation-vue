import { def, isObject } from '../shared/index'
import { baseHandlers } from './baseHandlers'

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

export function reactive<T extends object>(
    target: T,
): { [K in keyof T]: T[K] } {
    if (!isObject(target)) {
        console.warn(`value cannot be made reactive: ${String(target)}`)
        return target
    }
    if (
        isReactive(target) ||
        (target as Target)[ReactiveFlags.SKIP] ||
        !Object.isExtensible(target)
    ) {
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
    return !!(value && (<Target>value)[ReactiveFlags.IS_REACTIVE])
}

export function toRaw<T>(observed: T): T {
    const raw = observed && (observed as Target)[ReactiveFlags.RAW]
    return raw ? toRaw(raw) : observed
}

export function markRaw<T extends object>(value: T): T {
    def(value, ReactiveFlags.SKIP, true)
    return value
}
