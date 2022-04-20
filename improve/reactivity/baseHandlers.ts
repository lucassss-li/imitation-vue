import { hasOwn, isArray, isIntegerKey, isObject } from '../shared'
import { ITERATE_KEY, track, trigger } from './effect'
import { reactive, ReactiveFlags, reactiveMap, toRaw } from './reactive'
import { TriggerOpTypes } from './operations'

export const mutableHandlers = {
    get(target, key, receiver) {
        if (key === ReactiveFlags.IS_REACTIVE) {
            return true
        } else if (
            key === ReactiveFlags.RAW &&
            receiver === reactiveMap.get(target)
        ) {
            return target
        }
        const res = Reflect.get(target, key, receiver)
        track(target, key)
        return isObject(res) ? reactive(res) : res
    },
    set(target, key, value, receiver) {
        const rawValue = toRaw(value)
        const hadKey =
            isArray(target) && isIntegerKey(key)
                ? Number(key) < target.length
                : hasOwn(target, key)
        const res = Reflect.set(target, key, rawValue, receiver)
        if (hadKey) {
            trigger(target, TriggerOpTypes.SET, key)
        } else {
            trigger(target, TriggerOpTypes.ADD, key)
        }
        return res
    },
    deleteProperty(target: object, key: string | symbol): boolean {
        const hadKey = hasOwn(target, key)
        const result = Reflect.deleteProperty(target, key)
        if (result && hadKey) {
            trigger(target, TriggerOpTypes.DELETE, key)
        }
        return result
    },
    has(target: object, key: string | symbol): boolean {
        const result = Reflect.has(target, key)
        track(target, key)
        return result
    },
    ownKeys(target: object) {
        if (isArray(target)) {
            track(target, 'length')
        } else {
            track(target, ITERATE_KEY)
        }
        return Reflect.ownKeys(target)
    },
}
