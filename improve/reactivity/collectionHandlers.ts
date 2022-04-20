import { hasOwn, isObject } from '../shared'
import { ITERATE_KEY, track, trigger } from './effect'
import { TriggerOpTypes } from './operations'
import { reactive, ReactiveFlags, toRaw } from './reactive'

export type CollectionTypes = IterableCollections | WeakCollections

type IterableCollections = Map<any, any> | Set<any>
type WeakCollections = WeakMap<any, any> | WeakSet<any>
type MapTypes = Map<any, any> | WeakMap<any, any>
type SetTypes = Set<any> | WeakSet<any>

const mutableInstrumentations = {
    get(this: MapTypes, key: unknown) {
        const target = (this as any)[ReactiveFlags.RAW]
        const rawTarget = toRaw(target)
        const rawKey = toRaw(key)
        const res = rawTarget.get(rawKey)
        track(rawTarget, rawKey)
        return isObject(res) ? reactive(res) : res
    },
    set(this: MapTypes, key: unknown, value: unknown) {
        const target = (this as any)[ReactiveFlags.RAW]
        const rawTarget = toRaw(target)
        const rawKey = toRaw(key)
        const rawValue = toRaw(value)
        const res = rawTarget.set(rawKey, rawValue)
        if (rawTarget.has(rawKey)) {
            trigger(rawTarget, TriggerOpTypes.SET, rawKey)
        } else {
            trigger(rawTarget, TriggerOpTypes.ADD, rawKey)
        }
        return res
    },
    add(this: SetTypes, value: unknown) {
        const target = (this as any)[ReactiveFlags.RAW]
        const rawTarget = toRaw(target)
        const rawValue = toRaw(value)
        const res = rawTarget.add(rawValue)
        trigger(rawTarget, TriggerOpTypes.ADD, rawValue)
        return res
    },
    delete(this: IterableCollections, key: unknown) {
        const target = (this as any)[ReactiveFlags.RAW]
        const rawTarget = toRaw(target)
        const rawKey = toRaw(key)
        const res = rawTarget.delete(rawKey)
        trigger(rawTarget, TriggerOpTypes.DELETE, rawKey)
        return res
    },
    has(this: SetTypes, value: unknown) {
        const target = (this as any)[ReactiveFlags.RAW]
        const rawTarget = toRaw(target)
        const rawValue = toRaw(value)
        const res = rawTarget.has(rawValue)
        track(rawTarget, rawValue)
        return res
    },
    values(this: MapTypes) {
        const target = (this as any)[ReactiveFlags.RAW]
        const rawTarget = toRaw(target)
        const innerIterator = rawTarget.values()
        track(rawTarget, ITERATE_KEY)
        return {
            next() {
                const { value, done } = innerIterator.next()
                return done
                    ? { value, done }
                    : {
                          value: reactive(value),
                          done,
                      }
            },
            [Symbol.iterator]() {
                return this
            },
        }
    },
}

export const mutableCollectionHandlers = {
    get(target, key: string | symbol, receiver) {
        if (key === ReactiveFlags.IS_REACTIVE) {
            return true
        } else if (key === ReactiveFlags.RAW) {
            return target
        }
        return Reflect.get(
            hasOwn(mutableInstrumentations, key) && key in target
                ? mutableInstrumentations
                : target,
            key,
            receiver,
        )
    },
}
