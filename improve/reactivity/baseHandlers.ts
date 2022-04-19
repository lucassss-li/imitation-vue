import { isObject } from '../shared'
import { reactive, ReactiveFlags } from './reactive'

export const mutableHandlers = {
    get(target, key, receiver) {
        if (key === ReactiveFlags.IS_REACTIVE) {
            return true
        } else if (key === ReactiveFlags.RAW) {
            return target
        }
        const res = Reflect.get(target, key, receiver)
        return isObject(res) ? reactive(res) : res
    },
    set(target, key, value, receiver) {
        const res = Reflect.set(target, key, value, receiver)
        return res
    },
}
