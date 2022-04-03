import { readonly, isReadonly, isProxy } from '../reactive'
describe('readonly', () => {
    test('not change', () => {
        const original = { foo: 1 }
        const wrapped = readonly(original)
        expect(original).not.toBe(wrapped)
        expect(wrapped.foo).toBe(1)
        wrapped.foo = 2
        expect(wrapped.foo).toBe(1)
    })
    test('warn then call set', () => {
        console.warn = jest.fn()
        const original = { foo: 1 }
        const wrapped = readonly(original)
        wrapped.foo = 2
        expect(console.warn).toHaveBeenCalled()
    })
    test('isReadonly', () => {
        const original = { foo: 1 }
        const wrapped = readonly(original)
        expect(isReadonly(wrapped)).toBe(true)
        expect(isReadonly(original)).toBe(false)
    })

    test('nested readonly check', () => {
        const original = { a: { foo: 1 }, b: [1, 2, 3] }
        const observed = readonly(original)
        expect(isReadonly(observed)).toBe(true)
        expect(isReadonly(observed.a)).toBe(true)
        expect(isReadonly(observed.b)).toBe(true)
    })

    test('isProxy', () => {
        const original = { foo: 1 }
        const observed = readonly(original)
        expect(isProxy(observed)).toBe(true)
        expect(isProxy(observed.foo)).toBe(false)
        expect(isProxy(original)).toBe(false)
    })
})
