import { createDep, Dep } from './dep'

type KeyToDepMap = Map<any, Dep>
const targetMap = new WeakMap<any, KeyToDepMap>()

export class ReactiveEffect<T = any> {
    constructor(public fn: () => T) {}
    run() {
        activeEffect = this
        return this.fn()
    }
}
let activeEffect: ReactiveEffect | null = null
export function effect<T = any>(fn: () => T) {
    const _effect = new ReactiveEffect(fn)
    _effect.run()
}

export function track(target: object, key: unknown) {
    if (activeEffect) {
        let depsMap = targetMap.get(target)
        if (!depsMap) {
            targetMap.set(target, (depsMap = new Map()))
        }
        let dep = depsMap.get(key)
        if (!dep) {
            depsMap.set(key, (dep = createDep()))
        }
        dep.add(activeEffect)
    }
}

export function trigger(target: object, key: unknown) {
    const depsMap = targetMap.get(target)
    if (!depsMap) {
        return
    }
    const dep = depsMap.get(key)
    if (!dep) {
        return
    }
    dep.forEach(reactiveEffect => reactiveEffect.run())
}
