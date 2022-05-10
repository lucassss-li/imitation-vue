import { isObject } from '../shared/index'
import { track, trigger } from './effect'
import { TriggerOpTypes } from './operations'
import { reactive, toRaw } from './reactive'

export interface Ref<T = any> {
    value: T extends object ? { [k in keyof T]: T[k] } : T
}
function shouldReactive(val): val is object {
    return isObject(val)
}
class RefImpl<T> implements Ref {
    private _value: T
    constructor(value: T) {
        this._value = value
    }
    get value() {
        track(this, 'value')
        if (shouldReactive(this._value)) {
            return reactive(this._value)
        } else {
            return this._value
        }
    }
    set value(newVal) {
        const rawValue = toRaw(newVal)
        if (this._value !== rawValue) {
            this._value = rawValue
            trigger(this, TriggerOpTypes.SET, 'value')
        }
    }
}
export function ref<T>(value: T) {
    return new RefImpl<T>(value)
}
