import Vue from 'vue'
import App from './App.vue'
import { Plugin } from '../src'
import '../src/styles/index.css'

Vue.config.productionTip = false

Vue.use(Plugin)

new Vue({
  el: '#app',
  render: (h) => h(App),
})
