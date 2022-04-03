import { mutableHandler, readonlyHandler } from './baseHandler'

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
