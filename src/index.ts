import VueLazyYoutubeVideo from './VueLazyYoutubeVideo'

import { PluginObject } from 'vue'

export default VueLazyYoutubeVideo

export const Plugin: PluginObject<any> = {
  install(Vue) {
    Vue.component('LazyYoutubeVideo', VueLazyYoutubeVideo)
  },
}
