import { h, inject, provide } from '../../dist/vue-esm.js'
import ComponentB from './ComponentB.js'

export default {
    render() {
        return h('div', {}, [
            `componentA:${this.foo}`,
            h(ComponentB, {}, `componentB:`),
        ])
    },
    setup() {
        provide('foo', 'foo-aaa')
        const foo = inject('foo')
        return { foo }
    },
}
