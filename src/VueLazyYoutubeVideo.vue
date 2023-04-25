<template>
  <div class="y-video" @click="activated = true">
    <div class="y-video__inner" :style="styleObj">
      <iframe
        v-if="activated"
        ref="iframe"
        class="y-video__media"
        v-bind="iframeAttrs"
        :src="srcAttribute"
        @load="onIframeLoad()"
      ></iframe>
      <template v-else>
        <picture>
          <source
            v-if="webp"
            :srcset="
              thumbnail?.webp ||
              `https://i.ytimg.com/vi_webp/${id}/${previewImageSize}.webp`
            "
            type="image/webp"
          />
          <img
            class="y-video__media y-video__media--type--img"
            :src="
              thumbnail?.jpg ||
              `https://i.ytimg.com/vi/${id}/${previewImageSize}.jpg`
            "
            :alt="alt"
            v-bind="toListenersWithOn(thumbnailListeners || {})"
          />
        </picture>
        <slot v-if="$slots.button" name="button"></slot>
        <button
          v-else
          class="y-video__button"
          type="button"
          :aria-label="buttonLabel"
        >
          <slot v-if="$slots.icon" name="icon"></slot>
          <svg v-else viewBox="0 0 68 48" width="100%" height="100%">
            <path
              class="y-video__button-shape"
              d="M66.5 7.7c-.8-2.9-2.5-5.4-5.4-6.2C55.8.1 34 0 34 0S12.2.1 6.9 1.6c-3 .7-4.6 3.2-5.4 6.1a89.6 89.6 0 0 0 0 32.5c.8 3 2.5 5.5 5.4 6.3C12.2 47.9 34 48 34 48s21.8-.1 27.1-1.6c3-.7 4.6-3.2 5.4-6.1C68 35 68 24 68 24s0-11-1.5-16.3z"
            ></path>
            <path class="y-video__button-icon" d="M45 24L27 14v20"></path>
          </svg>
        </button>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'VueLazyYoutubeVideo',
}
</script>

<script lang="ts" setup>
import { PropType, computed, onUnmounted, ref } from 'vue'
import {
  DEFAULT_ASPECT_RATIO,
  DEFAULT_IFRAME_ATTRIBUTES,
  YOUTUBE_REGEX,
  PLAYER_SCRIPT_SRC,
  PLAYER_CHECK_MS,
  DEFAULT_ALT_ATTRIBUTE,
  DEFAULT_BUTTON_LABEL,
  DEFAULT_PREVIEW_IMAGE_SIZE,
  PREVIEW_IMAGE_SIZES,
} from './constants'
import type {
  InitPlayerEventPayload,
  LoadIframeEventPayload,
  Thumbnail,
} from './types'
import { isAspectRatio, toListenersWithOn } from './helpers'

const props = defineProps({
  src: {
    type: String,
    required: true,
    validator: (value: string) => YOUTUBE_REGEX.test(value),
  },
  alt: { type: String, required: false, default: DEFAULT_ALT_ATTRIBUTE },
  buttonLabel: { type: String, required: false, default: DEFAULT_BUTTON_LABEL },
  aspectRatio: {
    type: String,
    required: false,
    default: DEFAULT_ASPECT_RATIO,
    validator: isAspectRatio,
  },
  previewImageSize: {
    type: String,
    required: false,
    default: DEFAULT_PREVIEW_IMAGE_SIZE,
    validator: (value: any) => PREVIEW_IMAGE_SIZES.indexOf(value) !== -1,
  },
  thumbnail: { type: Object as PropType<Thumbnail>, required: false },
  iframeAttributes: {
    type: Object as PropType<Record<string, string | boolean | number>>,
    required: false,
  },
  webp: { type: Boolean, required: false, default: true },
  autoplay: { type: Boolean, required: false, default: false },
  thumbnailListeners: {
    type: Object as PropType<Record<string, Function | Function[]>>,
    required: false,
  },
  enablejsapi: { type: Boolean, required: false, default: false },
  playerOptions: {
    type: Object as PropType<YT.PlayerOptions>,
    required: false,
    default: () => ({}),
  },
  injectPlayerScript: { type: Boolean, required: false, default: false },
  parameters: {
    type: Object as PropType<YT.PlayerVars>,
    required: false,
    default: () => ({}),
  },
})

const emit = defineEmits<{
  (e: 'load:iframe', payload: LoadIframeEventPayload): void
  (e: 'init:player', payload: InitPlayerEventPayload): void
}>()

const activated = ref(props.autoplay)
const playerInstance = ref<YT.Player | null>(null)

const warn = (message: string) => {
  console.warn(`[vue-lazy-youtube-video]: ${message}`)
}

const id = computed(() => {
  const { src } = props
  const executionResult = YOUTUBE_REGEX.exec(src)
  if (executionResult !== null) {
    return executionResult[1]
  } else {
    warn(`Failed to extract video id from ${src}`)
    return ''
  }
})

const srcAttribute = computed(() => {
  const { src } = props
  const url = new URL(src)

  const { searchParams } = url
  searchParams.set('autoplay', '1')
  if (props.enablejsapi) {
    searchParams.set('enablejsapi', '1')
  }
  for (const [key, value] of Object.entries(props.parameters)) {
    searchParams.set(key, value)
  }

  return `${url.origin}${url.pathname}?${searchParams.toString()}`
})

const getPaddingBottomValue = (a: number, b: number) => `${(b / a) * 100}%`

const getPaddingBottom = () => {
  let { aspectRatio } = props
  const warningMessage = `Invalid value ${aspectRatio} supplied to \`aspectRatio\` property, instead fallback value ${DEFAULT_ASPECT_RATIO} is used `

  if (
    typeof aspectRatio !== 'string' ||
    (typeof aspectRatio === 'string' && isAspectRatio(aspectRatio) === false)
  ) {
    aspectRatio = DEFAULT_ASPECT_RATIO
    warn(warningMessage)
  }

  const [a, b] = aspectRatio.split(':').map(Number)
  return getPaddingBottomValue(a, b)
}

const styleObj = computed(() => {
  return {
    paddingBottom: getPaddingBottom(),
  }
})

const iframe = ref<HTMLIFrameElement | null>(null)

const initPlayerInstance = () => {
  if (!iframe.value) {
    throw new Error(
      '[vue-lazy-youtube-video]: YT.Player can not be instantiated without iframe element'
    )
  }
  const instance = new YT.Player(iframe.value, props.playerOptions)
  playerInstance.value = instance
  emit('init:player', { instance })
  return instance
}

const playerCheckInterval = ref<number | null>(null)
onUnmounted(() => {
  if (playerCheckInterval.value) {
    clearInterval(playerCheckInterval.value)
  }
})

const checkPlayer = () => {
  if (YT?.Player) {
    /* istanbul ignore else */
    if (playerCheckInterval.value) {
      clearInterval(playerCheckInterval.value)
    }

    initPlayerInstance()
    return true
  }
  return false
}

const doInjectPlayerScript = () => {
  const script = document.createElement('script')
  script.setAttribute('src', PLAYER_SCRIPT_SRC)

  script.onload = () => {
    playerCheckInterval.value = window.setInterval(() => {
      checkPlayer()
    }, PLAYER_CHECK_MS)
  }

  document.head.appendChild(script)
}

const iframeAttrs = computed(() => ({
  ...DEFAULT_IFRAME_ATTRIBUTES,
  ...props.iframeAttributes,
}))

const onIframeLoad = () => {
  emit('load:iframe', { iframe: iframe.value })

  if (props.enablejsapi) {
    try {
      window.YT.Player
      initPlayerInstance()
    } catch (e) {
      if (props.injectPlayerScript) {
        doInjectPlayerScript()
      } else {
        console.error(
          '[vue-lazy-youtube-video]: window.YT.Player is not defined. Make sure you either included the IFrame Player API or passed `injectPlayerScript` prop'
        )
        throw e
      }
    }
  }
}

const getPlayerInstance = () => playerInstance.value

defineExpose({
  getPlayerInstance,
})
</script>
