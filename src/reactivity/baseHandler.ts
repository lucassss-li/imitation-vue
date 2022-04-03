import { track, trigger } from './effect'

const get = createGetter()
const readonlyGet = createGetter(true)
const set = createSetter()

function createGetter<T extends object>(isReadonly = false) {
    return function get(target: T, key: string | symbol) {
        const res = Reflect.get(target, key)
        if (!isReadonly) {
            track(target, key)
        }
        return res
    }
}

function createSetter<T extends object, K extends keyof T>() {
    return function set(target: T, key: string | symbol, value: T[K]) {
        const res = Reflect.set(target, key, value)
        trigger(target, key)
        return res
    }
}

export const mutableHandler: ProxyHandler<object> = {
    get,
    set,
}
export const readonlyHandler: ProxyHandler<object> = {
    get: readonlyGet,
    set(target) {
        console.warn(`${target} is readonly`)
        return true
    },
}
