import { isObject, extend } from '../shared/index'
import { track, trigger } from './effect'
import { reactive, ReactiveFlags, readonly } from './reactive'

const get = createGetter()
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)
const set = createSetter()

function createGetter<T extends object>(isReadonly = false, isShallow = false) {
    return function get(target: T, key: string | symbol) {
        if (key === ReactiveFlags.IS_REACTIVE) {
            return !isReadonly
        }
        if (key === ReactiveFlags.IS_READONLY) {
            return isReadonly
        }
        const res = Reflect.get(target, key)
        if (isObject(res) && !isShallow) {
            return isReadonly ? readonly(res) : reactive(res)
        }
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

export const shallowReadonlyHandler: ProxyHandler<object> = extend(
    {},
    readonlyHandler,
    { get: shallowReadonlyGet },
)
