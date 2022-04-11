import { hasOwn } from '../shared'
import { track, trigger } from './effect'
import { ReactiveFlags, reactiveMap, reactive } from './reactive'

export const mutableHandlers: ProxyHandler<object> = {
    get(target: object, key: string | symbol, receiver) {
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
    set(target: object, key: string | symbol, value: any, receiver) {
        const res = Reflect.set(target, key, value, receiver)
        trigger(target, key)
        return res
    },
    deleteProperty(target: object, key: string | symbol): boolean {
        const hadKey = hasOwn(target, key)
        const result = Reflect.deleteProperty(target, key)
        if (result && hadKey) {
            trigger(target, key)
        }
        return result
    },
    has(target: object, key: string | symbol): boolean {
        const result = Reflect.has(target, key)
        track(target, key)
        return result
    },
}
