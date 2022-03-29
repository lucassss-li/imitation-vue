import { effect } from '../effect'
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
})
