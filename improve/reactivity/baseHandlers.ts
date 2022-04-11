export const mutableHandlers: ProxyHandler<object> = {
    get(target, key, receiver) {
        return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
        return Reflect.set(target, key, value, receiver)
    },
}
