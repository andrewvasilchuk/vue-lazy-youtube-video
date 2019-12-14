<template>
  <div class="y-video" @click="clickHandler">
    <div class="y-video__inner" :style="styleObj">
      <iframe
        v-if="clicked"
        v-bind="iframeAttributes"
        :src="generateURL()"
        allowfullscreen
        frameborder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        class="y-video__media"
      ></iframe>
      <template v-else>
        <picture>
          <source
            :srcset="
              thumbnail && thumbnail.webp ||
                `https://i.ytimg.com/vi_webp/${id}/${previewImageSize}.webp`
            "
            type="image/webp"
          />
          <img
            class="y-video__media y-video__media--type--img"
            :src="
              thumbnail && thumbnail.jpg ||
                `https://i.ytimg.com/vi/${id}/${previewImageSize}.jpg`
            "
            :alt="alt"
          />
        </picture>
        <slot name="button">
          <button
            type="button"
            class="y-video__button"
            :aria-label="buttonLabel"
          >
            <slot name="icon">
              <svg viewBox="0 0 68 48" version="1.1" width="100%" height="100%">
                <path
                  class="y-video__button-shape"
                  d="M66.5 7.7c-.8-2.9-2.5-5.4-5.4-6.2C55.8.1 34 0 34 0S12.2.1 6.9 1.6c-3 .7-4.6 3.2-5.4 6.1a89.6 89.6 0 0 0 0 32.5c.8 3 2.5 5.5 5.4 6.3C12.2 47.9 34 48 34 48s21.8-.1 27.1-1.6c3-.7 4.6-3.2 5.4-6.1C68 35 68 24 68 24s0-11-1.5-16.3z"
                ></path>
                <path class="y-video__button-icon" d="M45 24L27 14v20"></path>
              </svg>
            </slot>
          </button>
        </slot>
      </template>
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
        if (typeof value === 'string') {
          return (
            value.startsWith('https://www.youtube.com/watch?v=') ||
            value.startsWith('https://youtu.be/')
          )
        } else {
          return false
        }
      },
    },
    query: {
      type: String,
      default: '?autoplay=1',
    },
    alt: {
      type: String,
      default: 'Video thumbnail',
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
      type: Object,
      validator: val => 'jpg' in val && 'webp' in val
    },
    noCookie: {
      type: Boolean,
      default: false,
    },
    iframeAttributes: {
      type: Object
    }
  },
  data() {
    return {
      clicked: false
    }
  },
  computed: {
    id(): string {
      const regExp = /(?:(?:v=|(?:v%3D))|(?:\/(?:v|e)\/)|(?:(?:(?:youtu.be)|(?:embed))\/))([^&\n#?%]+)/
      const executionResult = regExp.exec(this.url)
      if (executionResult !== null) {
        return executionResult[1]
      } else {
        this.warn(
          `Failed to extract video id from ${this.url}`
        )
        return ''
      }
    },
    urlQuery() : string {
      const regExp = /\&([^&=]+)=([^&=]+)(?:&([^&=]+)=([^&=]+))*$/
      const executionResult = regExp.exec(this.url)
      if (executionResult !== null) {
        return executionResult[0]
      } else {
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
      }.com/embed/${this.id}${this.query}${this.urlQuery}`
    },
    clickHandler() {
      this.clicked = true

      this.$nextTick(() => {
        this.$emit('videoLoaded')
      })
    },
    getPaddingBottom() {
      let { aspectRatio } = this
      // Vue does not provide correct typescript support
      // @ts-ignore
      const defaultAspectRatio = this.$options.props.aspectRatio.default
      const warningMessage = `Invalid value ${aspectRatio} supplied to \`aspectRatio\` property, instead fallback value ${defaultAspectRatio} is used `

      if (typeof aspectRatio === 'string') {
        const [a, b] = aspectRatio.split(':')

        if (Number.isFinite(Number(a)) && Number.isFinite(Number(b))) {
        } else {
          aspectRatio = defaultAspectRatio
          this.warn(warningMessage)
        }
      } else {
        aspectRatio = defaultAspectRatio
        this.warn(warningMessage)
      }

      const [a, b] = aspectRatio.split(':')
      return this.getPaddingBottomValue(Number(a), Number(b))
    },
    getPaddingBottomValue(a: number, b: number) {
      return `${(b / a) * 100}%`
    },
    warn(message: string) {
      console.warn(`[vue-lazy-youtube-video]: ${message}`)
    }
  },
})
</script>

<style>
:root {
  --y-video-background-color: #000;
  --y-video-button-width: 68px;
  --y-video-button-height: 48px;
  --y-video-button-padding: 0;
  --y-video-button-border-width: 0;
  --y-video-button-background-color: transparent;
  --y-video-button-fill: #212121;
  --y-video-button-fill-opacity: 0.8;
  --y-video-button-active-fill: red;
  --y-video-button-active-fill-opacity: 1;
  --y-video-button-icon-fill: #fff;
}

.y-video {
  background-color: var(--y-video-background-color, #000);
  cursor: pointer;
}

.y-video__inner {
  position: relative;
}

.y-video__embed,
.y-video__media {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-width: 0;
}

.y-video__media--type--img {
  object-fit: cover;
}

.y-video__button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: var(--y-video-button-padding, 0);
  border-width: var(--y-video-button-border-width, 0);
  background-color: var(--y-video-button-background-color, transparent);
  width: var(--y-video-button-width, 68px);
  height: var(--y-video-button-height, 48px);
  cursor: pointer;
}

.y-video__button-shape {
  fill: var(--y-video-button-fill, #212121);
  fill-opacity: var(--y-video-button-fill-opacity, 0.8);
}

.y-video__button-icon {
  fill: var(--y-video-button-icon-fill, #fff);
}

.y-video__button:focus {
  outline: 0;
}

.y-video__button:focus .y-video__button-shape {
  fill: var(--y-video-button-active-fill, red);
  fill-opacity: var(--y-video-button-active-fill-opacity, 1);
}

.y-video:hover .y-video__button-shape {
  fill: var(--y-video-button-active-fill, red);
  fill-opacity: var(--y-video-button-active-fill-opacity, 1);
}
</style>
