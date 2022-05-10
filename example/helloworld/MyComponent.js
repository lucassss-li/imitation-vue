import { h } from '../../dist/vue-esm.js'

export default {
    render() {
        return h(
            'div',
            {
                onClick: this.emitAdd,
            },
            `component${this.count}`,
        )
    },
    setup(props, { emit }) {
        const emitAdd = () => {
            emit('add',1,'a')
        }
        return { emitAdd }
    },
}
