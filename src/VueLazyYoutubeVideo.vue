<template>
  <div class="y-video" @click="clickHandler">
    <div class="y-video__inner" :style="styleObj">
      <template v-if="!isVideoLoaded">
        <picture>
          <source
            :srcset="
              thumbnail ||
                `https://i.ytimg.com/vi_webp/${id}/${previewImageSize}.webp`
            "
            type="image/webp"
          />
          <img
            class="y-video__media y-video__media--type--img"
            :src="
              thumbnail ||
                `https://i.ytimg.com/vi/${id}/${previewImageSize}.jpg`
            "
            :alt="alt"
          />
        </picture>
        <button type="button" class="y-video__button" :aria-label="buttonLabel">
          <svg viewBox="0 0 68 48" version="1.1" width="100%" height="100%">
            <path
              class="y-video__button-shape"
              d="M66.5 7.7c-.8-2.9-2.5-5.4-5.4-6.2C55.8.1 34 0 34 0S12.2.1 6.9 1.6c-3 .7-4.6 3.2-5.4 6.1a89.6 89.6 0 0 0 0 32.5c.8 3 2.5 5.5 5.4 6.3C12.2 47.9 34 48 34 48s21.8-.1 27.1-1.6c3-.7 4.6-3.2 5.4-6.1C68 35 68 24 68 24s0-11-1.5-16.3z"
            ></path>
            <path class="y-video__button-icon" d="M45 24L27 14v20"></path>
          </svg>
        </button>
      </template>
      <iframe
        v-else
        :src="generateURL()"
        allowfullscreen
        allow="autoplay"
        class="y-video__media"
      ></iframe>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'VueLazyYoutubeVideo',
  props: {
    url: {
      type: String,
      required: true,
      validator: value => {
        return value.indexOf('https://www.youtube.com/watch?') !== 1
      },
    },
    query: {
      type: String,
      default: '?rel=0&showinfo=0&autoplay=1',
    },
    alt: {
      type: String,
      default: 'Video alternative image',
    },
    buttonLabel: {
      type: String,
      default: 'Play video',
    },
    aspectRatio: {
      type: String,
      default: '16:9',
      validator: value => {
        const pattern = /^\d+:\d+$/
        return pattern.test(value)
      },
    },
    previewImageSize: {
      type: String,
      default: 'maxresdefault',
      validator: value =>
        [
          'default',
          'mqdefault',
          'sddefault',
          'hqdefault',
          'maxresdefault',
        ].indexOf(value) !== -1,
    },
    thumbnail: {
      type: String,
    },
    noCookie: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isVideoLoaded: false,
    }
  },
  computed: {
    id(): string {
      const regExp = /^https:\/\/www\.youtube\.com\/watch\?v=(.+)$/
      const executionResult = regExp.exec(this.url)
      if (executionResult !== null) {
        return executionResult[1]
      } else {
        console.error(
          `[vue-lazy-youtube-video]: failed to extract video id from "${this.url}"`
        )
        return ''
      }
    },
    styleObj(): object {
      return {
        paddingBottom: this.getPaddingBottom(),
      }
    },
  },
  methods: {
    generateURL() {
      return `https://www.youtube${
        this.noCookie ? '-nocookie' : ''
      }.com/embed/${this.id}${this.query}`
    },
    clickHandler() {
      this.isVideoLoaded = true
      this.$emit('videoLoaded')
    },
    getPaddingBottom() {
      const [a, b] = this.aspectRatio.split(':')
      return `${(Number(b) / Number(a)) * 100}%`
    },
  },
})
</script>

<style lang="scss">
.y-video {
  $block: &;
  background-color: #000;
  cursor: pointer;

  &__inner {
    position: relative;
  }

  &__embed,
  &__media {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-width: 0;
  }

  &__media {
    &--type {
      &--img {
        object-fit: cover;
      }
    }
  }

  &__button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-width: 0;
    background-color: transparent;
    width: 68px;
    height: 48px;
    padding: 0;
    cursor: pointer;

    &-shape {
      fill: #212121;
      fill-opacity: 0.8;
    }

    &-icon {
      fill: #fff;
    }

    &:focus {
      outline: 0;

      #{$block}__button-shape {
        fill: red;
        fill-opacity: 1;
      }
    }
  }

  &:hover {
    #{$block}__button-shape {
      fill: red;
      fill-opacity: 1;
    }
  }
}
</style>