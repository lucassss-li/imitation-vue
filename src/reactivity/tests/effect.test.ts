import { effect, stop } from '../effect'
import { reactive } from '../reactive'
describe('effect', () => {
    test('object', () => {
        const user = reactive({ age: 10 })
        let nextAge = 0
        effect(() => {
            nextAge = user.age + 1
        })
        expect(nextAge).toBe(11)
        user.age += 1
        expect(nextAge).toBe(12)
    })

    test('array', () => {
        const arr = reactive([1, 2, 3])
        let num = 0
        effect(() => {
            num = arr[2]
        })
        expect(num).toBe(3)
        arr[2] = 10
        expect(num).toBe(10)
    })
    test('complex', () => {
        let a = 0
        effect(() => {
            a++
        })
        const original = { foo: 1 }
        const observed = reactive(original)
        expect(a).toBe(1)
        observed.foo++
        expect(a).toBe(1)
        let b = 0
        effect(() => {
            b = observed.foo
        })
        expect(b).toBe(2)
        observed.foo++
        expect(b).toBe(3)
    })
    test('runner', () => {
        let foo = 1
        const runner = effect(() => {
            foo++
            return 'foo'
        })
        const res = runner()
        expect(foo).toBe(3)
        expect(res).toBe('foo')
    })

    test('scheduler', () => {
        let dummy
        let a = 0
        const scheduler = jest.fn(() => {
            a++
        })
        const obj = reactive({ foo: 1 })
        const runner = effect(
            () => {
                dummy = obj.foo
            },
            { scheduler },
        )
        expect(scheduler).not.toHaveBeenCalled()
        expect(dummy).toBe(1)
        obj.foo++
        expect(scheduler).toHaveBeenCalledTimes(1)
        expect(a).toBe(1)
        expect(dummy).toBe(1)
        runner()
        expect(dummy).toBe(2)
    })

    test('stop', () => {
        let a = 0
        const ob = reactive({ foo: 1 })
        const runner = effect(() => {
            a = ob.foo
        })
        expect(a).toBe(1)
        ob.foo++
        expect(a).toBe(2)
        stop(runner)
        ob.foo = 3
        expect(a).toBe(2)
        runner()
        expect(a).toBe(3)
    })

    test('onStop', () => {
        let dummy
        const ob = reactive({ foo: 1 })
        const onStop = jest.fn()
        const runner = effect(
            () => {
                dummy = ob.foo
            },
            { onStop },
        )
        expect(dummy).toBe(1)
        stop(runner)
        expect(onStop).toBeCalledTimes(1)
    })
})
