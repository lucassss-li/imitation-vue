import { track, trigger } from './effect'
export function reactive<T extends object>(
    target: T,
): { [K in keyof T]: T[K] } {
    return new Proxy(target, {
        get(target, key) {
            const res = Reflect.get(target, key)
            track(target, key)
            return res
        },
        set(target, key, value) {
            const res = Reflect.set(target, key, value)
            trigger(target, key)
            return res
        },
    })
}
