import { h, ref } from '../../dist/vue-esm.js'
import component from './component.js'
export default {
    render() {
        return h('div', { onClick: this.change }, [
            h(component, {
                props: {
                    count: this.count,
                },
            }),
        ])
    },
    setup() {
        const count = ref(true)
        function change() {
            count.value = !count.value
        }
        return { count, change }
    },
}
