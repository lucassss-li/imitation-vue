import { hasChanged, isObject } from '../shared'
import { ReactiveEffect, trackEffect, triggerEffects } from './effect'
import { reactive } from './reactive'

class RefImpl<T> {
    private dep: Set<ReactiveEffect>
    private _raw: T
    private _value: T
    constructor(value: T) {
        this.dep = new Set()
        this._raw = value
        this._value = convert<T>(value)
    }
    get value() {
        trackEffect(this.dep)
        return this._value
    }
    set value(new_val: T) {
        if (hasChanged(this._raw, new_val)) {
            this._value = convert(new_val)
            triggerEffects(this.dep)
        }
        this._raw = new_val
    }
}

function convert<T>(value: T) {
    return isObject(value) ? reactive(value) : value
}

export function ref<T>(raw: T) {
    return new RefImpl<T>(raw)
}
