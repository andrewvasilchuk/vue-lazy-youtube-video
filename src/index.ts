import VueLazyYoutubeVideo from './VueLazyYoutubeVideo.vue'
import { App, Plugin } from 'vue'

export default VueLazyYoutubeVideo

export const plugin: Plugin = {
  install: (app: App) => {
    app.component('LazyYoutubeVideo', VueLazyYoutubeVideo)
  },
}
