import { h, inject } from '../../dist/vue-esm.js'

export default {
    render() {
        return h('div', {}, `componentB:${this.foo}+${this.too}+${this.coo}`)
    },
    setup() {
        const foo = inject('foo')
        const too = inject('too')
        const coo = inject('coo', 'coo-default')
        return { foo, too, coo }
    },
}
