import { h } from '../../dist/vue-esm.js'
window.self = null
export default {
    render() {
        window.self = this
        return h(
            'div',
            {
                style: { color: 'red' },
                class: ['container'],
            },
            [
                h('div', {}, 'hello'),
                h('div', { style: { color: 'green' } }, this.msg),
            ],
        )
    },
    setup() {
        return {
            msg: 'world',
        }
    },
}
