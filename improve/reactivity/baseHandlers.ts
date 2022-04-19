import { ReactiveFlags } from './reactive'

export const mutableHandlers = {
    get(target, key, receiver) {
        if (key === ReactiveFlags.IS_REACTIVE) {
            return true
        }
        const res = Reflect.get(target, key, receiver)
        return res
    },
    set(target, key, value, receiver) {
        const res = Reflect.set(target, key, value, receiver)
        return res
    },
}
