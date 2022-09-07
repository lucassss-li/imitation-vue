import { isObject, isSymbol } from '../shared/index'
import { makeMap } from '../shared/makeMap'
import {
    isReactive,
    reactive,
    ReactiveFlags,
    Target,
    reactiveMap,
    toRaw,
} from './reactive'

const isNonTrackableKeys = makeMap(`__proto__`)
const buildInSymbols = new Set(
    Object.getOwnPropertyNames(Symbol)
        .map(key => (Symbol as any)[key])
        .filter(isSymbol),
)

export const baseHandlers = {
    get(target: Target, key: string | symbol, receiver: object) {
        if (key === ReactiveFlags.IS_REACTIVE) {
            return true
        } else if (
            key === ReactiveFlags.RAW &&
            receiver === reactiveMap.get(target)
        ) {
            return target
        }
        let res = Reflect.get(target, key, receiver)
        if (isSymbol(key) ? buildInSymbols.has(key) : isNonTrackableKeys(key)) {
            return res
        }
        if (isObject(res) && !isReactive(res)) {
            res = reactive(res)
        }
        return res
    },
    set(
        target: Target,
        key: string | symbol,
        value: unknown,
        receiver: object,
    ) {
        return Reflect.set(target, key, toRaw(value), receiver)
    },
}
