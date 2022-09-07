import { effect } from '../effec'
import { reactive } from '../reactive'

describe('reactivity/effect', () => {
    it('should run the passed function once (wrapped by a effect)', () => {
        // eslint-disable-next-line
        const fnSpy = jest.fn(() => {})
        effect(fnSpy)
        expect(fnSpy).toHaveBeenCalledTimes(1)
    })
    it('should observe basic properties', () => {
        let dummy
        const counter = reactive({ num: 0 })
        effect(() => (dummy = counter.num))

        expect(dummy).toBe(0)
        counter.num = 7
        expect(dummy).toBe(7)
    })
})
