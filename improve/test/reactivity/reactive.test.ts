import { reactive, isReactive } from '../../reactivity/reactive'

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
})
