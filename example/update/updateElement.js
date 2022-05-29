import { h, ref } from '../../dist/vue-esm.js'
export default {
    render() {
        return h(
            'div',
            { onClick: this.change },
            this.count ? list['textToText'][0] : list['textToText'][1],
        )
    },
    setup() {
        const count = ref(true)
        function change() {
            count.value = !count.value
        }
        return { count, change }
    },
}

const list = {
    textToText: ['text1', 'text2'],
    arrayToText: [
        [
            h('div', { key: 'a' }, 'a'),
            h('div', { key: 'b' }, 'b'),
            h('div', { key: 'c' }, 'c'),
        ],
        'text',
    ],
    textToArray: [
        'text',
        [
            h('div', { key: 'a' }, 'a'),
            h('div', { key: 'b' }, 'b'),
            h('div', { key: 'c' }, 'c'),
        ],
    ],
    arrayToArray: [
        [
            h('div', { key: 'a' }, 'a'),
            h('div', { key: 'b' }, 'b'),
            h('div', { key: 'c' }, 'c'),
            h('div', { key: 'd' }, 'd'),
            h('div', { key: 'e' }, 'e'),
            h('div', { key: 'z' }, 'z'),
            h('div', { key: 'f' }, 'f'),
            h('div', { key: 'g' }, 'g'),
        ],
        [
            h('div', { key: 'a' }, 'a'),
            h('div', { key: 'b' }, 'b'),
            h('div', { key: 'd' }, 'd'),
            h('div', { key: 'c' }, 'c'),
            h('div', { key: 'y' }, 'y'),
            h('div', { key: 'e' }, 'e'),
            h('div', { key: 'f' }, 'f'),
            h('div', { key: 'g' }, 'g'),
        ],
    ],
}
