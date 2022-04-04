export const extend = Object.assign

export const isObject = (val: unknown): val is object => {
    return val !== null && typeof val === 'object'
}

export function hasChanged<T>(val: T, new_val: T): boolean {
    return !Object.is(val, new_val)
}
