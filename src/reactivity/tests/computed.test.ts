import { computed } from '../computed'
import { reactive } from '../reactive'
import { ref } from '../ref'

describe('computed', () => {
    test('reactive$computed', () => {
        const user = reactive({ age: 18 })
        const age = computed(() => {
            return user.age
        })
        expect(age.value).toBe(18)
    })
    test('ref$computed', () => {
        const user = ref(18)
        const age = computed(() => {
            return user.value
        })
        expect(age.value).toBe(18)
    })
    test('lazy', () => {
        const user = reactive({ age: 18 })
        const getter = jest.fn(() => {
            return user.age
        })
        const age = computed(getter)
        expect(getter).toBeCalledTimes(0)
        expect(age.value).toBe(18)
        expect(getter).toBeCalledTimes(1)
        expect(age.value).toBe(18)
        expect(getter).toBeCalledTimes(1)
        user.age = 20
        expect(age.value).toBe(20)
        expect(getter).toBeCalledTimes(2)
    })
})
