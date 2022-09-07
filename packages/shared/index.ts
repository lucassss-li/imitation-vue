export const isObject = (value: unknown): value is object =>
    value !== null && typeof value === 'object'
export const isSymbol = (value: unknown): value is symbol =>
    typeof value === 'symbol'
export const def = (obj: object, key: string | symbol, value: any) => {
    Object.defineProperty(obj, key, {
        configurable: true,
        enumerable: false,
        value,
    })
}
