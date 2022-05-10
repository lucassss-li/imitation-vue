import { h } from '../../dist/vue-esm.js'
import MyComponent from './MyComponent.js'
window.self = null
export default {
    render() {
        window.self = this
        return h(
            'div',
            {
                style: { color: 'red' },
                class: ['container'],
                onClick() {
                    console.log('click')
                },
            },
            [
                h('div', {}, 'hello'),
                h('div', { style: { color: 'green' } }, this.msg),
                h(MyComponent, {
                    count: 1,
                    onAdd(a,b) {
                        console.log(a,b)
                    },
                }),
            ],
        )
    },
    setup() {
        return {
            msg: 'world',
        }
    },
}
