<template>
  <section>
    <ul>
      <li>
        <LazyYoutubeVideo
          src="https://www.youtube.com/embed/4JS70KB9GS0"
          alt="foo"
          button-label="baz"
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
  </section>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'AppPage',
})
</script>

<style>
ul {
  padding-left: 0;
  margin-top: 0;
  margin-bottom: 0;
  list-style: none;
}

li + li {
  margin-top: 8px;
}
</style>
