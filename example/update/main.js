import { createApp } from '../../dist/vue-esm.js'
import ArrayToText from './ArrayToText.js'

const rootContainer = document.querySelector('#app')
createApp(ArrayToText).mount(rootContainer)
