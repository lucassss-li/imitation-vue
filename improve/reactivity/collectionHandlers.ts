import { hasOwn, isObject } from '../shared'
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
        return isObject(res) ? reactive(res) : res
    },
    set(this: MapTypes, key: unknown, value: unknown) {
        const target = (this as any)[ReactiveFlags.RAW]
        const rawTarget = toRaw(target)
        const rawKey = toRaw(key)
        rawTarget.set(rawKey, value)
    },
    add(this: SetTypes, value: unknown) {
        const target = (this as any)[ReactiveFlags.RAW]
        const rawTarget = toRaw(target)
        const rawValue = toRaw(value)
        rawTarget.add(rawValue)
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
