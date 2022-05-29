import { h, ref, getCurrentInstance, nextTick } from '../../dist/vue-esm.js'
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
        const instance = getCurrentInstance()
        const count = ref(0)
        function change() {
            for (let i = 0; i < 100; i++) {
                count.value++
            }
            console.log(instance)
            nextTick(() => {
                console.log(instance)
            })
        }
        return { count, change }
    },
}
