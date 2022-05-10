import { isArray } from '../shared/index'
import { TriggerOpTypes } from './operations'

export const ITERATE_KEY = Symbol('iterate')

type KeyToDepMap = Map<any, Set<ReactiveEffect & EffectOptions>>
const targetMap = new WeakMap<any, KeyToDepMap>()

let activeEffect
class ReactiveEffect {
    deps: Set<ReactiveEffect>[] = []
    constructor(private fn) {}
    run() {
        for (const dep of this.deps.values()) {
            dep.delete(this)
        }
        activeEffect = this
        const res = this.fn()
        activeEffect = null
        return res
    }
}

type EffectOptions = {
    scheduler?: () => any
}
export function effect<T extends () => any>(
    fn: T,
    options: EffectOptions = {},
) {
    const effect = new ReactiveEffect(fn)
    Object.assign(effect, options)
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
    const deps: Array<ReactiveEffect & EffectOptions> = []
    const set = depsMap.get(key)
    if (set) {
        deps.push(...set.values())
    }
    if (isArray(target)) {
        const length_dep = depsMap.get('length')
        if (length_dep) {
            deps.push(...length_dep.values())
        }
    } else {
        const length_dep = depsMap.get(ITERATE_KEY)
        if (length_dep) {
            deps.push(...length_dep.values())
        }
    }
    for (const effect of deps) {
        if (effect.scheduler) {
            effect.scheduler()
        } else {
            effect.run()
        }
    }
}
