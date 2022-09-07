import { effect } from '../effec'

describe('reactivity/effect', () => {
    it('should run the passed function once (wrapped by a effect)', () => {
        // eslint-disable-next-line
        const fnSpy = jest.fn(() => {})
        effect(fnSpy)
        expect(fnSpy).toHaveBeenCalledTimes(1)
    })
})
