import { createApp } from '../../dist/vue-esm.js'
import updateElement from './updateElement.js'
import updateComponent from './updateComponent.js'

const rootContainer = document.querySelector('#app')
createApp(updateComponent).mount(rootContainer)
