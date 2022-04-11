import { track, trigger } from './effect'
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
        track(target, key)
        return reactive(Reflect.get(target, key, receiver))
    },
    set(target, key, value, receiver) {
        const res = Reflect.set(target, key, value, receiver)
        trigger(target, key)
        return res
    },
}
