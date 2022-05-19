import { h, ref } from '../../dist/vue-esm.js'
export default {
    render() {
        return h(
            'div',
            {
                foo: this.count,
                style: { color: this.count },
            },
            [
                h(
                    'div',
                    {
                        onClick: this.add,
                    },
                    ['按钮'],
                ),
                this.count,
            ],
        )
    },
    setup() {
        const count = ref('green')
        function add() {
            count.value = null
        }
        return { count, add }
    },
}
