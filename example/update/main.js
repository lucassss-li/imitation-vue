import { createApp } from '../../dist/vue-esm.js'
import updateElement from './updateElement.js'
import updateComponent from './updateComponent.js'
import nextTick from './nextTick.js'

const rootContainer = document.querySelector('#app')
createApp(nextTick).mount(rootContainer)
