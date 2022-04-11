import { mutableHandlers } from './baseHandlers'

export function reactive(target: any) {
    return createReactiveObject(target, mutableHandlers)
}

function createReactiveObject(target: any, baseHandlers: ProxyHandler<any>) {
    return new Proxy(target, baseHandlers)
}
