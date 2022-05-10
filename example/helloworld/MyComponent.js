import { h, renderSlots } from '../../dist/vue-esm.js'

export default {
    render() {
        return h(
            'div',
            {
                onClick: this.emitAdd,
            },
            [
                renderSlots(this.$slots, 'header'),
                `component${this.count}`,
                renderSlots(this.$slots, 'footer'),
            ],
        )
    },
    setup(props, { emit }) {
        const emitAdd = () => {
            emit('add', 1, 'a')
        }
        return { emitAdd }
    },
}
