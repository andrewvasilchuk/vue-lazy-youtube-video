<template>
  <LazyYoutubeVideo
    src="https://www.youtube.com/embed/4JS70KB9GS0"
    preview-image-size="maxresdefault"
    :thumbnail-listeners="thumbnailListeners"
  />
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
