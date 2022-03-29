class ReactiveEffect {
    run() {
        activeEffect = this
        this.fn()
    }
    constructor(private fn: () => void) {}
}

const targetMap = new Map()
export function track<T>(target: T, key: string | symbol) {
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        depsMap = new Map()
        targetMap.set(target, depsMap)
    }
    let dep = depsMap.get(target)
    if (!dep) {
        dep = new Set()
        depsMap.set(key, dep)
    }
    dep.add(activeEffect)
}

export function trigger<T>(target: T, key: string | symbol) {
    const depsMap = targetMap.get(target)
    const dep = depsMap.get(key)
    for (const effect of dep) {
        effect.run()
    }
}

let activeEffect: ReactiveEffect
export function effect(fn: () => void) {
    const _effect = new ReactiveEffect(fn)
    _effect.run()
}
