import { isObject } from '../shared/index'
import {
    mutableHandler,
    readonlyHandler,
    shallowReadonlyHandler,
} from './baseHandler'

export const enum ReactiveFlags {
    IS_REACTIVE = 'is_reactive',
    IS_READONLY = 'is_readonly',
}

type RestoreType<T> = { [K in keyof T]: T[K] }

function createActiveObject<T extends object>(
    target: T,
    baseHandler: ProxyHandler<T>,
) {
    return new Proxy<RestoreType<T>>(target, baseHandler)
}

export function reactive<T extends object>(target: T): RestoreType<T> {
    return createActiveObject<T>(target, mutableHandler)
}

export function readonly<T extends object>(target: T): RestoreType<T> {
    return createActiveObject<T>(target, readonlyHandler)
}

export function isReactive<T extends object>(raw: T): boolean {
    return !!(<{ is_reactive: boolean }>raw)[ReactiveFlags.IS_REACTIVE]
}

export function isReadonly<T extends object>(raw: T): boolean {
    return !!(<{ is_readonly: boolean }>raw)[ReactiveFlags.IS_READONLY]
}

export function shallowReadonly<T extends object>(target: T): RestoreType<T> {
    return createActiveObject<T>(target, shallowReadonlyHandler)
}

export function isProxy(val: unknown) {
    return isObject(val) && (isReactive(val) || isReadonly(val))
}
