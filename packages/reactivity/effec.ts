class ReactiveEffect<T = any> {
    constructor(public fn: () => T) {}
    run() {
        this.fn()
    }
}

export function effect<T = any>(fn: () => T): void {
    const _effect = new ReactiveEffect(fn)
    _effect.run()
}
