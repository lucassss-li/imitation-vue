import { reactive, isReactive, toRaw } from '../../reactivity/reactive'

describe('reactivity/reactive', () => {
    test('reactive Object', () => {
        const original = { foo: 1 }
        const observed = reactive(original)
        expect(observed).not.toBe(original)
        expect(observed.foo).toBe(1)
        observed.foo = 2
        expect(original.foo).toBe(2)
    })
    test('reactive primitive type', () => {
        const original = 'hello world'
        const fn = jest.fn()
        console.warn = fn
        expect(fn).not.toBeCalled()
        //@ts-ignore
        reactive(original)
        expect(fn).toHaveBeenCalledTimes(1)
    })
    test('isReactive', () => {
        const original = { foo: 1 }
        const observed = reactive(original)
        expect(isReactive(original)).toBe(false)
        expect(isReactive(observed)).toBe(true)
    })
    test('nested reactive', () => {
        const original = {
            nested: {
                foo: 1,
            },
            array: [{ bar: 2 }],
        }
        const observed = reactive(original)
        expect(isReactive(observed.nested)).toBe(true)
        expect(isReactive(observed.array)).toBe(true)
        expect(isReactive(observed.array[0])).toBe(true)
    })
    test('toRaw', () => {
        const original = { foo: 1 }
        const observed = reactive(original)
        expect(toRaw(observed)).toBe(original)
    })
    test('observing IterableCollections(Map, Set)', () => {
        const map = reactive(new Map())

        expect(map instanceof Map).toBe(true)
        expect(isReactive(map)).toBe(true)

        map.set('key', {})
        expect(isReactive(map.get('key'))).toBe(true)

        const set = reactive(new Set())

        expect(set instanceof Set).toBe(true)
        expect(isReactive(set)).toBe(true)

        set.add({})
    })
    test('observing subtypes of IterableCollections(Map, Set)', () => {
        // subtypes of Map
        class CustomMap extends Map {}
        const cmap = reactive(new CustomMap())

        expect(cmap instanceof Map).toBe(true)
        expect(isReactive(cmap)).toBe(true)

        cmap.set('key', {})
        expect(isReactive(cmap.get('key'))).toBe(true)

        // subtypes of Set
        class CustomSet extends Set {}
        const cset = reactive(new CustomSet())

        expect(cset instanceof Set).toBe(true)
        expect(isReactive(cset)).toBe(true)
    })
    test('observing subtypes of WeakCollections(WeakMap, WeakSet)', () => {
        // subtypes of WeakMap
        class CustomMap extends WeakMap {}
        const cmap = reactive(new CustomMap())

        expect(cmap instanceof WeakMap).toBe(true)
        expect(isReactive(cmap)).toBe(true)

        const key = {}
        cmap.set(key, {})
        expect(isReactive(cmap.get(key))).toBe(true)

        // subtypes of WeakSet
        class CustomSet extends WeakSet {}
        const cset = reactive(new CustomSet())

        expect(cset instanceof WeakSet).toBe(true)
        expect(isReactive(cset)).toBe(true)
    })
})
