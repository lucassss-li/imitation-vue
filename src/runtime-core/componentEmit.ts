export function emit(instance, event, ...args) {
    const { props } = instance
    const capitalize = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1)
    }
    const handler = props[`on${capitalize(event)}`]
    handler && handler(...args)
}
