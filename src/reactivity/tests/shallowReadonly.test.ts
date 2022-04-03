import { isReadonly, shallowReadonly } from '../reactive'

describe('shallowReadonly', () => {
    test('should not make non-reactive properties reactive', () => {
        const observed = shallowReadonly({ n: { foo: 1 } })
        expect(isReadonly(observed)).toBe(true)
        expect(isReadonly(observed.n)).toBe(false)
    })
})
