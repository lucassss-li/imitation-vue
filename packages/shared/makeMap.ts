export function makeMap(
    str: string,
    ignoreCase?: boolean,
): (key: string) => boolean {
    const map: Record<string, boolean> = Object.create(null)
    const list: Array<string> = str.split(',')
    for (let i = 0; i < list.length; i++) {
        map[list[i]] = true
    }
    return ignoreCase ? val => map[val.toLowerCase()] : val => map[val]
}
