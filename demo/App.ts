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
    onPlayerInit(player: YT.Player) {
      console.log(player)
    },
  },
  render(h): VNode {
    return h('ul', {}, [
      h('li', { style: { width: '512px' } }, [
        h(VueLazyYoutubeVideo, {
          props: {
            src: 'https://www.youtube.com/embed/4JS70KB9GS0',
            alt: 'foo',
            buttonLabel: 'baz',
            imgListeners: this.thumbnailListeners,
          },
        }),
      ]),
      h('li', undefined, [
        h(VueLazyYoutubeVideo, {
          props: {
            src: 'https://www.youtube.com/embed/4JS70KB9GS0',
            aspectRatio: '1:1',
            parameters: {
              start: 32,
            },
          },
        }),
      ]),
      h('li', undefined, [
        h(VueLazyYoutubeVideo, {
          props: {
            src: 'https://www.youtube.com/embed/4JS70KB9GS0',
            thumbnail: { jpg: 'https://placehold.co/1280x720' },
          },
        }),
      ]),
      h('li', undefined, [
        h(VueLazyYoutubeVideo, {
          props: {
            src: 'https://www.youtube.com/embed/4JS70KB9GS0',
            previewImageSize: 'default',
            webp: false,
            autoplay: true,
            iframeAttributes: this.iframeAttributes,
            enablejsapi: true,
            injectPlayerScript: true,
          },
          on: {
            'load:iframe': this.onIframeLoad,
            'init:player': this.onPlayerInit,
          },
        }),
      ]),
    ])
  },
})
