export const isObject = (val: any): val is object => {
    return val !== null && typeof val === 'object'
}

export const objectToString = Object.prototype.toString
export const toTypeString = (value: unknown): string =>
    objectToString.call(value)
export const toRawType = (value: unknown): string => {
    return toTypeString(value).slice(8, -1)
}

const hasOwnProperty = Object.prototype.hasOwnProperty
export const hasOwn = (
    val: object,
    key: string | symbol,
): key is keyof typeof val => hasOwnProperty.call(val, key)
