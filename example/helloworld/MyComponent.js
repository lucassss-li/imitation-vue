import { h } from '../../dist/vue-esm.js'

export default {
    render() {
        return h('div', {}, `component${this.count}`)
    },
    setup(props) {
        console.log(props)
        return {}
    },
}
