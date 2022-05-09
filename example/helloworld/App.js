import { h } from '../../dist/vue-esm.js'
export default {
    render() {
        return h(
            'div',
            {
                style: { color: 'red' },
                class: ['container'],
            },
            [
                h('div', {}, 'hello'),
                h('div', { style: { color: 'green' } }, 'world'),
            ],
        )
    },
    setup() {
        return {
            msg: 'world',
        }
    },
}
