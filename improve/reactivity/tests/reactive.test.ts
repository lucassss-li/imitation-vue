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
})
