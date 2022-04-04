import { effect } from '../effect'
import { ref, isRef, unRef, proxyRef } from '../ref'

describe('ref', () => {
    test('happy path', () => {
        const num = ref(1)
        expect(num.value).toBe(1)
        const ob = ref({ foo: 1 })
        expect(ob.value.foo).toBe(1)
    })
    test('should be reactive', () => {
        const a = ref(1)
        let dummy
        let calls = 0
        effect(() => {
            calls++
            dummy = a.value
        })
        expect(calls).toBe(1)
        expect(dummy).toBe(1)
        a.value = 2
        expect(calls).toBe(2)
        expect(dummy).toBe(2)
        a.value = 2
        expect(calls).toBe(2)
        expect(dummy).toBe(2)
    })

    test('should make nested properties reactive', () => {
        const a = ref({
            count: 1,
        })
        let dummy
        effect(() => {
            dummy = a.value.count
        })
        expect(dummy).toBe(1)
        a.value.count = 2
        expect(dummy).toBe(2)
    })

    test('isRef', () => {
        const original = {
            count: 1,
        }
        const a = ref(original)
        expect(isRef(original)).toBe(false)
        expect(isRef(a)).toBe(true)
    })

    test('unRef', () => {
        const original = {
            count: 1,
        }
        const a = ref(original)
        expect(unRef(a)).toBe(original)
        expect(unRef(1)).toBe(1)
    })

    test('proxyRef', () => {
        const complex = { foo: 1, ob: ref(2) }
        const proxy_complex = proxyRef(complex)
        expect(proxy_complex.foo).toBe(1)
        expect(proxy_complex.ob).toBe(2)
        proxy_complex.foo = 2
        proxy_complex.ob = 3
        proxy_complex.ob = ref(4)
    })
})
