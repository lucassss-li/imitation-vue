export class ReactiveEffect {
    deps = new Set<Set<ReactiveEffect>>()
    active = true
    run() {
        activeEffect = this
        const res = this.fn()
        activeEffect = null
        return res
    }
    stop() {
        if (this.active) {
            this.deps.forEach(dep => dep.delete(this))
            this.onStop && this.onStop()
            this.active = false
        }
    }
    public scheduler?: () => void
    public onStop?: () => void
    constructor(
        private fn: () => void,
        options?: { scheduler?: () => void; onStop?: () => void },
    ) {
        Object.assign(this, options)
    }
}

const targetMap = new Map()
export function track<T>(target: T, key: string | symbol) {
    if (activeEffect) {
        let depsMap = targetMap.get(target)
        if (!depsMap) {
            depsMap = new Map()
            targetMap.set(target, depsMap)
        }
        let dep = depsMap.get(key)
        if (!dep) {
            dep = new Set()
            depsMap.set(key, dep)
        }
        trackEffect(dep)
    }
}

export function trackEffect(dep: Set<ReactiveEffect>) {
    if (activeEffect && !dep.has(activeEffect)) {
        dep.add(activeEffect)
        activeEffect?.deps.add(dep)
    }
}

export function trigger<T>(target: T, key: string | symbol) {
    const depsMap = targetMap.get(target)
    let dep
    if (depsMap) {
        dep = depsMap.get(key)
    }
    triggerEffects(dep)
}

export function triggerEffects(dep: Set<ReactiveEffect>) {
    if (dep) {
        for (const effect of dep) {
            if (effect.scheduler) {
                effect.scheduler()
            } else {
                effect.run()
            }
        }
    }
}

let activeEffect: ReactiveEffect | null
export function effect(
    fn: () => void,
    options: { scheduler?: () => void; onStop?: () => void } = {},
) {
    const _effect = new ReactiveEffect(fn, options)
    _effect.run()
    const runner = () => {
        return _effect.run()
    }
    runner.effect = _effect
    return runner
}

export function stop(runner: { effect: ReactiveEffect }): void {
    runner.effect.stop()
}
