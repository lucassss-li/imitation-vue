import { ReactiveEffect } from './effect'

class ComputedRefImpl<T> {
    private _getter: () => T
    private _value!: T
    private locked = false
    private _effect: ReactiveEffect
    constructor(getter: () => T) {
        this._getter = getter
        this._effect = new ReactiveEffect(getter, {
            scheduler: () => {
                this.locked = false
            },
        })
    }
    get value(): T {
        if (!this.locked) {
            this.locked = true
            this._value = <T>(<unknown>this._effect.run())
        }
        return this._value
    }
}

export function computed<T>(getter: () => T): ComputedRefImpl<T> {
    return new ComputedRefImpl<T>(getter)
}
