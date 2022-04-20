import { effect } from '../../reactivity/effect'
import { reactive, isReactive } from '../../reactivity/reactive'

describe('reactivity/effect', () => {
    test('should run the passed function once (wrapped by a effect)', () => {
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
    it('should observe multiple properties', () => {
        let dummy
        const counter = reactive({ num1: 0, num2: 0 })
        effect(() => (dummy = counter.num1 + counter.num1 + counter.num2))

        expect(dummy).toBe(0)
        counter.num1 = counter.num2 = 7
        expect(dummy).toBe(21)
    })
    it('should handle multiple effects', () => {
        let dummy1, dummy2
        const counter = reactive({ num: 0 })
        effect(() => (dummy1 = counter.num))
        effect(() => (dummy2 = counter.num))

        expect(dummy1).toBe(0)
        expect(dummy2).toBe(0)
        counter.num++
        expect(dummy1).toBe(1)
        expect(dummy2).toBe(1)
    })
    it('should observe nested properties', () => {
        let dummy
        const counter = reactive({ nested: { num: 0 } })
        effect(() => (dummy = counter.nested.num))

        expect(dummy).toBe(0)
        counter.nested.num = 8
        expect(dummy).toBe(8)
    })
    it('should observe delete operations', () => {
        let dummy
        const obj = reactive({ prop: 'value' })
        effect(() => (dummy = obj.prop))

        expect(dummy).toBe('value')
        // @ts-ignore
        delete obj.prop
        expect(dummy).toBe(undefined)
    })
    it('should observe has operations', () => {
        let dummy
        const obj = reactive<{ prop: string | number }>({ prop: 'value' })
        effect(() => (dummy = 'prop' in obj))

        expect(dummy).toBe(true)
        // @ts-ignore
        delete obj.prop
        expect(dummy).toBe(false)
        obj.prop = 12
        expect(dummy).toBe(true)
    })
    it('should observe properties on the prototype chain', () => {
        let dummy
        const counter = reactive({ num: 0 })
        const parentCounter = reactive({ num: 2 })
        Object.setPrototypeOf(counter, parentCounter)
        effect(() => (dummy = counter.num))

        expect(dummy).toBe(0)
        // @ts-ignore
        delete counter.num
        expect(dummy).toBe(2)
        parentCounter.num = 4
        expect(dummy).toBe(4)
        counter.num = 3
        expect(dummy).toBe(3)
    })
    it('should observe has operations on the prototype chain', () => {
        let dummy
        const counter = reactive({ num: 0 })
        const parentCounter = reactive({ num: 2 })
        Object.setPrototypeOf(counter, parentCounter)
        effect(() => (dummy = 'num' in counter))

        expect(dummy).toBe(true)
        // @ts-ignore
        delete counter.num
        expect(dummy).toBe(true)
        // @ts-ignore
        delete parentCounter.num
        expect(dummy).toBe(false)
        counter.num = 3
        expect(dummy).toBe(true)
    })
    it('should observe inherited property accessors', () => {
        let dummy, parentDummy, hiddenValue: any
        const obj = reactive<{ prop?: number }>({})
        const parent = reactive({
            set prop(value) {
                hiddenValue = value
            },
            get prop() {
                return hiddenValue
            },
        })
        Object.setPrototypeOf(obj, parent)
        effect(() => (dummy = obj.prop))
        effect(() => (parentDummy = parent.prop))

        expect(dummy).toBe(undefined)
        expect(parentDummy).toBe(undefined)
        obj.prop = 4
        expect(dummy).toBe(4)
        // this doesn't work, should it?
        // expect(parentDummy).toBe(4)
        parent.prop = 2
        expect(dummy).toBe(2)
        expect(parentDummy).toBe(2)
    })
    it('should observe function call chains', () => {
        let dummy
        const counter = reactive({ num: 0 })
        effect(() => (dummy = getNum()))

        function getNum() {
            return counter.num
        }

        expect(dummy).toBe(0)
        counter.num = 2
        expect(dummy).toBe(2)
    })
    it('should observe iteration', () => {
        let dummy
        const list = reactive(['Hello'])
        effect(() => (dummy = list.join(' ')))

        expect(dummy).toBe('Hello')
        list.push('World!')
        expect(dummy).toBe('Hello World!')
        list.shift()
        expect(dummy).toBe('World!')
    })
    it('should observe implicit array length changes', () => {
        let dummy
        const list = reactive(['Hello'])
        effect(() => (dummy = list.join(' ')))

        expect(dummy).toBe('Hello')
        list[1] = 'World!'
        expect(dummy).toBe('Hello World!')
        list[3] = 'Hello!'
        expect(dummy).toBe('Hello World!  Hello!')
    })
    it('should observe sparse array mutations', () => {
        let dummy
        const list = reactive<string[]>([])
        list[1] = 'World!'
        effect(() => (dummy = list.join(' ')))

        expect(dummy).toBe(' World!')
        list[0] = 'Hello'
        expect(dummy).toBe('Hello World!')
        list.pop()
        expect(dummy).toBe('Hello')
    })
    it('should observe enumeration', () => {
        let dummy = 0
        const numbers = reactive<Record<string, number>>({ num1: 3 })
        effect(() => {
            dummy = 0
            for (const key in numbers) {
                dummy += numbers[key]
            }
        })
        expect(dummy).toBe(3)
        numbers.num2 = 4
        expect(dummy).toBe(7)
        delete numbers.num1
        expect(dummy).toBe(4)
    })
    it('scheduler', () => {
        let dummy
        const counter = reactive({ num1: 0, num2: 0 })
        effect(() => counter.num1 + counter.num2, {
            scheduler: () => {
                dummy = counter.num1 + counter.num1 + counter.num2
            },
        })
        counter.num1 = counter.num2 = 7
        expect(dummy).toBe(21)
    })
    it('map', () => {
        const _map = new Map()
        const map = reactive(_map)
        expect(isReactive(map)).toBe(true)
        map.set('key', {})
        expect(isReactive(map.get('key'))).toBe(true)
        map.set('num', 1)
        let dummy
        effect(() => {
            dummy = map.get('num')
        })
        expect(dummy).toBe(1)
        map.set('num', 2)
        expect(dummy).toBe(2)
    })
    it('set', () => {
        const _set = new Set()
        const set = reactive(_set)
        expect(isReactive(set)).toBe(true)
        set.add(1)
        expect(set.has(1)).toBe(true)
        let flag
        effect(() => {
            flag = set.has(1)
        })
        expect(flag).toBe(true)
        set.delete(1)
        expect(flag).toBe(false)
    })
})
