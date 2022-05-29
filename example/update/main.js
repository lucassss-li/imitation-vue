import { createApp } from '../../dist/vue-esm.js'
import ArrayToText from './updateElement.js'

const rootContainer = document.querySelector('#app')
createApp(ArrayToText).mount(rootContainer)
