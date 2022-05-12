import { h, provide } from '../../dist/vue-esm.js'
import ComponentA from './ComponentA.js'
export default {
    render() {
        return h('div', {}, ['main', h(ComponentA)])
    },
    setup() {
        provide('foo', 'foo-value')
        provide('too', 'too-value')
        return {
            msg: 'world',
        }
    },
}
