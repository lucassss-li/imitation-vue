import { ReactiveFlags, reactiveMap, reactive } from './reactive'

export const mutableHandlers: ProxyHandler<object> = {
    get(target, key, receiver) {
        if (key === ReactiveFlags.IS_REACTIVE) {
            return true
        } else if (
            key === ReactiveFlags.RAW &&
            receiver === reactiveMap.get(target)
        ) {
            return target
        }
        return reactive(Reflect.get(target, key, receiver))
    },
    set(target, key, value, receiver) {
        return Reflect.set(target, key, value, receiver)
    },
}
