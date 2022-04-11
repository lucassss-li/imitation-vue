import { reactive, isReactive } from '../reactive'
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
    test('target is not object', () => {
        const str = 'hello world'
        const warn = jest.fn()
        console.warn = warn
        expect(warn).not.toHaveBeenCalled()
        // eslint-disable-next-line
        reactive(<object>(<unknown>str))
        expect(warn).toBeCalledTimes(1)
    })
    test('avoid reactive a already reactive object', () => {
        const original = { foo: 1 }
        const observed1 = reactive(original)
        const observed2 = reactive(original)
        expect(observed1).toBe(observed2)
    })
    test('nested reactives', () => {
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
        expect(isReactive(observed.nested.foo)).toBe(false)
    })
})
