import Vue from 'vue'
import App from './App.vue'
import VueLazyYoutubeVideo from '../src'

Vue.config.productionTip = false

Vue.component('LazyYoutubeVideo', VueLazyYoutubeVideo)

new Vue({
  el: '#app',
  render: h => h(App),
})
