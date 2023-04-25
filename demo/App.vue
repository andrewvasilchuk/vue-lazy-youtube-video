<template>
  <ul>
    <li>
      <VueLazyYoutubeVideo
        src="https://www.youtube.com/embed/uxPdPpi5W4o"
        previewImageSize="maxresdefault"
        alt="foo"
        buttonLabel="baz"
        :imgListeners="thumbnailListeners"
      ></VueLazyYoutubeVideo>
    </li>
    <li>
      <VueLazyYoutubeVideo
        src="https://www.youtube.com/embed/uxPdPpi5W4o"
        aspectRatio="1:1"
        previewImageSize="default"
        :parameters="{ start: 32 }"
      ></VueLazyYoutubeVideo>
    </li>
    <li>
      <VueLazyYoutubeVideo
        src="https://www.youtube.com/embed/uxPdPpi5W4o"
        :thumbnail="{ webp: 'foo', jpg: 'bar' }"
      ></VueLazyYoutubeVideo>
    </li>
    <li>
      <VueLazyYoutubeVideo
        src="https://www.youtube.com/embed/uxPdPpi5W4o"
        :webp="false"
        :autoplay="false"
        :iframeAttributes="iframeAttributes"
        enablejsapi
        injectPlayerScript
        @load:iframe="onIframeLoad($event)"
        @init:player="onPlayerInit($event)"
      ></VueLazyYoutubeVideo>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import VueLazyYoutubeVideo from '../src'
import { InitPlayerEventPayload, LoadIframeEventPayload } from '../types'

const thumbnailListeners = {
  load() {
    console.log('load')
  },
}
const iframeAttributes = {
  id: 'foo',
}

const onIframeLoad = ({ iframe }: LoadIframeEventPayload) => {
  console.log('<iframe />: ', iframe)
  const id = iframe ? iframe.id : iframeAttributes.id
  console.log('Resolved <iframe /> id: ', id)
  const player = new YT.Player(id, {})
  console.log('YT.Player instance: ', player)
  setTimeout(() => {
    player.stopVideo()
  }, 3000)
}

const onPlayerInit = ({ instance }: InitPlayerEventPayload) => {
  console.log(instance)
}
</script>
