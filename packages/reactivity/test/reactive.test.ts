import { isReactive, markRaw, reactive, toRaw } from '../reactive'

describe('reactivity/reactive', () => {
    test('Object', () => {
        const original = { foo: 1 }
        const observed = reactive(original)
        expect(observed).not.toBe(original)
        expect(isReactive(observed)).toBe(true)
        expect(isReactive(original)).toBe(false)
        // get
        expect(observed.foo).toBe(1)
        // has
        expect('foo' in observed).toBe(true)
        // ownKeys
        expect(Object.keys(observed)).toEqual(['foo'])
    })
    test('proto', () => {
        const obj = {}
        const reactiveObj = reactive(obj)
        expect(isReactive(reactiveObj)).toBe(true)
        // read prop of reactiveObject will cause reactiveObj[prop] to be reactive
        // @ts-ignore
        const prototype = reactiveObj['__proto__']
        expect(isReactive(prototype)).toBe(false)
        const otherObj = { data: ['a'] }
        expect(isReactive(otherObj)).toBe(false)
        const reactiveOther = reactive(otherObj)
        expect(isReactive(reactiveOther)).toBe(true)
        expect(reactiveOther.data[0]).toBe('a')
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
    test('observing the same value multiple times should return same Proxy', () => {
        const original = { foo: 1 }
        const observed = reactive(original)
        const observed2 = reactive(original)
        expect(observed2).toBe(observed)
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
    test('observing already observed value should return same Proxy', () => {
        const original = { foo: 1 }
        const observed = reactive(original)
        const observed2 = reactive(observed)
        expect(observed2).toBe(observed)
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
    test('toRaw', () => {
        const original = { foo: 1 }
        const observed = reactive(original)
        expect(toRaw(observed)).toBe(original)
        expect(toRaw(original)).toBe(original)
    })
    test('toRaw on object using reactive as prototype', () => {
        const original = reactive({})
        const obj = Object.create(original)
        const raw = toRaw(obj)
        expect(raw).toBe(obj)
        expect(raw).not.toBe(toRaw(original))
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
    test('markRaw', () => {
        const obj = reactive({
            foo: { a: 1 },
            bar: markRaw({ b: 2 }),
        })
        expect(isReactive(obj.foo)).toBe(true)
        expect(isReactive(obj.bar)).toBe(false)
    })
    test('should not observe non-extensible objects', () => {
        const obj = reactive({
            foo: Object.preventExtensions({ a: 1 }),
            // sealed or frozen objects are considered non-extensible as well
            bar: Object.freeze({ a: 1 }),
            baz: Object.seal({ a: 1 }),
        })
        expect(isReactive(obj.foo)).toBe(false)
        expect(isReactive(obj.bar)).toBe(false)
        expect(isReactive(obj.baz)).toBe(false)
    })

    test('should not observe objects with __v_skip', () => {
        const original = {
            foo: 1,
            __v_skip: true,
        }
        const observed = reactive(original)
        expect(isReactive(observed)).toBe(false)
    })
})
