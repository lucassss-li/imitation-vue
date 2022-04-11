export const isObject = (value: unknown) => {
    return value !== null && typeof value === 'object'
}

const hasOwnProperty = Object.prototype.hasOwnProperty
export const hasOwn = (
    value: object,
    key: string | symbol,
): key is keyof typeof value => hasOwnProperty.call(value, key)
