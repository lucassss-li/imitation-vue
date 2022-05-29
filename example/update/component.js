import { h } from '../../dist/vue-esm.js'

export default {
    render() {
        return h('div', {}, [h('div', {}, `count:${this.props.count}`)])
    },
    setup() {
        return {}
    },
}
