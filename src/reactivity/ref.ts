import { hasChanged, isObject } from '../shared/index'
import { ReactiveEffect, trackEffect, triggerEffects } from './effect'
import { reactive } from './reactive'

class RefImpl<T> {
    private dep: Set<ReactiveEffect>
    public _raw: T
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

export function isRef(val: unknown): boolean {
    return val instanceof RefImpl
}

export function unRef<T>(val: RefImpl<T> | T): T {
    if (val instanceof RefImpl) {
        return val._raw
    } else {
        return val
    }
}

export function proxyRef<T extends object>(
    val: T,
): { [K in keyof T]: T[K] | unknown } {
    return new Proxy(val, {
        get(target, key, receiver) {
            return unRef(Reflect.get(target, key, receiver))
        },
        set(target, key, value, receiver) {
            if (isRef(Reflect.get(target, key, receiver)) && !isRef(value)) {
                return (Reflect.get(target, key, receiver).value = value)
            } else {
                return Reflect.set(target, key, value, receiver)
            }
        },
    })
}
