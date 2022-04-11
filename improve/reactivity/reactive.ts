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

export function reactive(target: any) {
    return createReactiveObject(target, mutableHandlers)
}

function createReactiveObject(target: any, baseHandlers: ProxyHandler<any>) {
    return new Proxy(target, baseHandlers)
}

export function isReactive(value: unknown): boolean {
    return !!(<Target>value)[ReactiveFlags.IS_REACTIVE]
}
