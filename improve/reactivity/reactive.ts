import { def, isObject, toRawType } from '../shared/index'
import { mutableHandlers } from './baseHandlers'
import { mutableCollectionHandlers } from './collectionHandlers'

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

const enum TargetType {
    INVALID = 0,
    COMMON = 1,
    COLLECTION = 2,
}

function targetTypeMap(rawType: string) {
    switch (rawType) {
        case 'Object':
        case 'Array':
            return TargetType.COMMON
        case 'Map':
        case 'Set':
        case 'WeakMap':
        case 'WeakSet':
            return TargetType.COLLECTION
        default:
            return TargetType.INVALID
    }
}

function getTargetType(value: Target) {
    return value[ReactiveFlags.SKIP] || !Object.isExtensible(value)
        ? TargetType.INVALID
        : targetTypeMap(toRawType(value))
}

export const reactiveMap = new WeakMap<object, any>()

export function reactive<T extends object>(target: T): { [K in keyof T]: T[K] }
export function reactive(target: Target) {
    if (!isObject(target)) {
        console.warn('target is not a object')
        return target
    }
    if (isReactive(target)) {
        return target
    }
    const targetType = getTargetType(target)
    if (targetType === TargetType.INVALID) {
        return target
    }
    let proxy = reactiveMap.get(target)
    if (proxy) {
        return proxy
    }
    proxy = new Proxy(
        target,
        targetType === TargetType.COMMON
            ? mutableHandlers
            : mutableCollectionHandlers,
    )
    reactiveMap.set(target, proxy)
    return proxy
}

export const isReactive = (val: unknown) => {
    return !!(isObject(val) && (val as Target)[ReactiveFlags.IS_REACTIVE])
}

export function toRaw<T>(observed: T): T {
    const raw = observed && (observed as Target)[ReactiveFlags.RAW]
    return raw ? toRaw(raw) : observed
}

export function markRaw<T extends object>(value: T): T {
    def(value, ReactiveFlags.SKIP, true)
    return value
}
