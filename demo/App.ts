import Vue, { VNode } from 'vue'

import { LoadIframeEventPayload } from '../src/types'
import VueLazyYoutubeVideo from '../src'

export default Vue.extend({
  name: 'AppPage',
  data() {
    return {
      thumbnailListeners: {
        load() {
          console.log('load')
        },
      },
      iframeAttributes: {
        id: 'foo',
      },
    }
  },
  methods: {
    onIframeLoad({ iframe }: LoadIframeEventPayload) {
      console.log('<iframe />: ', iframe)
      const id = iframe ? iframe.id : this.iframeAttributes.id
      console.log('Resolved <iframe /> id: ', id)
      const player = new YT.Player(id, {})
      console.log('YT.Player instance: ', player)
      setTimeout(() => {
        player.stopVideo()
      }, 3000)
    },
  },
  render(h): VNode {
    return h('ul', {}, [
      h('li', {}, [
        h(VueLazyYoutubeVideo, {
          props: {
            src: 'https://www.youtube.com/embed/4JS70KB9GS0',
            previewImageSize: 'maxresdefault',
            alt: 'foo',
            buttonLabel: 'baz',
            imgListeners: this.thumbnailListeners,
          },
        }),
      ]),
      h('li', {}, [
        h(VueLazyYoutubeVideo, {
          props: {
            src: 'https://www.youtube.com/embed/4JS70KB9GS0',
            aspectRatio: '1:1',
            previewImageSize: 'default',
          },
        }),
      ]),
      h('li', {}, [
        h(VueLazyYoutubeVideo, {
          props: {
            src: 'https://www.youtube.com/embed/4JS70KB9GS0',
            thumbnail: { webp: 'foo', jpg: 'bar' },
          },
        }),
      ]),
      h('li', {}, [
        h(VueLazyYoutubeVideo, {
          props: {
            src: 'https://www.youtube.com/embed/4JS70KB9GS0',
            webp: false,
            autoplay: true,
            iframeAttributes: this.iframeAttributes,
          },
          on: {
            'load:iframe': this.onIframeLoad,
          },
        }),
      ]),
    ])
  },
})
