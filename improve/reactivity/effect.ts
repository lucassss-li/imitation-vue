import { isArray } from '../shared'
import { TriggerOpTypes } from './operations'

type KeyToDepMap = Map<any, Set<ReactiveEffect>>
const targetMap = new WeakMap<any, KeyToDepMap>()

let activeEffect
class ReactiveEffect {
    deps: Set<ReactiveEffect>[] = []
    constructor(private fn) {}
    run() {
        activeEffect = this
        return this.fn()
        activeEffect = null
    }
}
export function effect<T extends () => any>(fn: T) {
    const effect = new ReactiveEffect(fn)
    effect.run()
}

export function track(target, key) {
    if (activeEffect) {
        let depsMap = targetMap.get(target)
        if (!depsMap) {
            targetMap.set(target, (depsMap = new Map()))
        }
        let dep = depsMap.get(key)
        if (!dep) {
            depsMap.set(key, (dep = new Set()))
        }
        dep.add(activeEffect)
    }
}

export function trigger(target: object, type: TriggerOpTypes, key?: unknown) {
    const depsMap = targetMap.get(target)
    if (!depsMap) return
    const deps: ReactiveEffect[] = []
    const set = depsMap.get(key)
    if (set) {
        deps.push(...set.values())
    }
    if (type === TriggerOpTypes.ADD) {
        if (isArray(target)) {
            const length_dep = depsMap.get('length')
            if (length_dep) {
                deps.push(...length_dep.values())
            }
        }
    }
    for (const effect of deps) {
        effect.run()
    }
}
