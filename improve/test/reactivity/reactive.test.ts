import { reactive, isReactive, toRaw, markRaw } from '../../reactivity/reactive'

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

    test('observed value should proxy mutations to original (Object)', () => {
        const original: any = { foo: 1 }
        const observed = reactive(original)
        // set
        observed.bar = 1
        expect(observed.bar).toBe(1)
        expect(original.bar).toBe(1)
        // delete
        delete observed.foo
        expect('foo' in observed).toBe(false)
        expect('foo' in original).toBe(false)
    })
    test('original value change should reflect in observed value (Object)', () => {
        const original: any = { foo: 1 }
        const observed = reactive(original)
        // set
        original.bar = 1
        expect(original.bar).toBe(1)
        expect(observed.bar).toBe(1)
        // delete
        delete original.foo
        expect('foo' in original).toBe(false)
        expect('foo' in observed).toBe(false)
    })
    test('setting a property with an unobserved value should wrap with reactive', () => {
        const observed = reactive<{ foo?: object }>({})
        const raw = {}
        observed.foo = raw
        expect(observed.foo).not.toBe(raw)
        expect(isReactive(observed.foo)).toBe(true)
    })
    test('observing already observed value should return same Proxy', () => {
        const original = { foo: 1 }
        const observed = reactive(original)
        const observed2 = reactive(observed)
        expect(observed2).toBe(observed)
    })
    test('observing the same value multiple times should return same Proxy', () => {
        const original = { foo: 1 }
        const observed = reactive(original)
        const observed2 = reactive(original)
        expect(observed2).toBe(observed)
    })
    test('should not pollute original object with Proxies', () => {
        const original: any = { foo: 1 }
        const original2 = { bar: 2 }
        const observed = reactive(original)
        const observed2 = reactive(original2)
        observed.bar = observed2
        expect(observed.bar).toBe(observed2)
        expect(original.bar).toBe(original2)
    })
    test('toRaw on object using reactive as prototype', () => {
        const original = reactive({})
        const obj = Object.create(original)
        const raw = toRaw(obj)
        expect(raw).toBe(obj)
        expect(raw).not.toBe(toRaw(original))
    })
    test('markRaw', () => {
        const obj = reactive({
            foo: { a: 1 },
            bar: markRaw({ b: 2 }),
        })
        expect(isReactive(obj.foo)).toBe(true)
        expect(isReactive(obj.bar)).toBe(false)
    })
})
