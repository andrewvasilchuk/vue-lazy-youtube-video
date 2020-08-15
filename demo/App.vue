<template>
  <ul>
    <li>
      <LazyYoutubeVideo
        src="https://www.youtube.com/embed/4JS70KB9GS0"
        preview-image-size="maxresdefault"
        alt="foo"
        button-label="baz"
        :img-listeners="thumbnailListeners"
      />
    </li>
    <li>
      <LazyYoutubeVideo
        src="https://www.youtube.com/embed/4JS70KB9GS0"
        aspect-ratio="1:1"
        preview-image-size="default"
      />
    </li>
    <li>
      <LazyYoutubeVideo
        src="https://www.youtube.com/embed/4JS70KB9GS0"
        :thumbnail="{ webp: 'foo', jpg: 'bar' }"
      />
    </li>
    <li>
      <LazyYoutubeVideo
        src="https://www.youtube.com/embed/4JS70KB9GS0?start=8&enablejsapi=1"
        :webp="false"
        autoplay
        :iframe-attributes="iframeAttributes"
        @load:iframe="onIframeLoad"
      />
    </li>
  </ul>
</template>

<script lang="ts">
import Vue from 'vue'

import { LoadIframeEventPayload } from '../src/types'

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
})
</script>
