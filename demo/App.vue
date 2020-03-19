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
        src="https://www.youtube.com/embed/4JS70KB9GS0?start=8"
        :webp="false"
        autoplay
      />
    </li>
  </ul>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'AppPage',
  data() {
    return {
      thumbnailListeners: {
        load() {
          console.log('load')
        },
      },
    }
  },
})
</script>
