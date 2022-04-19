import { reactive } from '../../reactivity/reactive'

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
})
