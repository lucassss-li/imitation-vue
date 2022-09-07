let activeEffect: null | ReactiveEffect = null
class ReactiveEffect<T = any> {
    constructor(public fn: () => T) {}
    run() {
        activeEffect = this
        this.fn()
        activeEffect = null
    }
}

export function effect<T = any>(fn: () => T): void {
    const _effect = new ReactiveEffect(fn)
    _effect.run()
}

type KeyToDepMap = Map<any, Set<ReactiveEffect>>
const targetMap = new WeakMap<any, KeyToDepMap>()

export function track(target: object, key: unknown) {
    let keyToDepMap = targetMap.get(target)
    if (!keyToDepMap) {
        keyToDepMap = new Map<any, Set<ReactiveEffect>>()
        targetMap.set(target, keyToDepMap)
    }
    let deps = keyToDepMap.get(key)
    if (!deps) {
        deps = new Set<ReactiveEffect>()
        keyToDepMap.set(key, deps)
    }
    if (activeEffect) {
        deps.add(activeEffect)
    }
}

export function trigger(target: object, key: unknown) {
    const keyToDepMap = targetMap.get(target)
    if (!keyToDepMap) {
        return
    }
    const deps = keyToDepMap.get(key)
    if (!deps) {
        return
    }
    deps.forEach(effect => effect.run())
}
