import { readonly } from '../reactive'
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
})
