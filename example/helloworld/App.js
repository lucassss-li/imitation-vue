import { h } from '../../dist/vue-esm.js'
export default {
    render() {
        return h('div', {}, [h('div', {}, 'hello'), h('div', {}, 'world')])
    },
    setup() {
        return {
            msg: 'world',
        }
    },
}
