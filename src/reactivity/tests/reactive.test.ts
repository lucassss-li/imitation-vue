import { reactive } from '../reactive'
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
})
