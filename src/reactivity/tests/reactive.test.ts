import { reactive, isReactive, isProxy } from '../reactive'
describe('reactive', () => {
    test('object', () => {
        const original = { foo: 1 }
        const observed = reactive(original)
        expect(observed).not.toBe(original)
        expect(observed.foo).toBe(original.foo)
    })
    test('array', () => {
        const original = [1, 2, 3]
        const observed = reactive(original)
        expect(observed).not.toBe(original)
        expect(observed[1]).toBe(original[1])
    })
    test('isReactive', () => {
        const original = { foo: 1 }
        const observed = reactive(original)
        expect(isReactive(observed)).toBe(true)
        expect(isReactive(original)).toBe(false)
    })

    test('nested reactive check', () => {
        const original = { a: { foo: 1 }, b: [1, 2, 3] }
        const observed = reactive(original)
        expect(isReactive(observed)).toBe(true)
        expect(isReactive(observed.a)).toBe(true)
        expect(isReactive(observed.b)).toBe(true)
    })

    test('isProxy', () => {
        const original = { foo: 1 }
        const observed = reactive(original)
        expect(isProxy(observed)).toBe(true)
        expect(isProxy(observed.foo)).toBe(false)
        expect(isProxy(original)).toBe(false)
    })
})
