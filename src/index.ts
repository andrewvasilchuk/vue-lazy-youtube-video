import VueLazyYoutubeVideo from './VueLazyYoutubeVideo.vue'

import { PluginObject } from 'vue'

export default VueLazyYoutubeVideo

export const Plugin: PluginObject<any> = {
  install(Vue) {
    Vue.component('LazyYoutubeVideo', VueLazyYoutubeVideo)
  },
}
