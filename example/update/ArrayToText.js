import { h, ref } from '../../dist/vue-esm.js'
export default {
    render() {
        return h(
            'div',
            { onClick: this.change },
            this.count ? 'textChild' : [h('div', {}, 'aaa'), 'b'],
        )
    },
    setup() {
        const count = ref(true)
        function change() {
            console.log(count.value)
            count.value = !count.value
        }
        return { count, change }
    },
}
