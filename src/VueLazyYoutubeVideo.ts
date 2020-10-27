import Vue from 'vue'
import type { PropType, CreateElement, VNode } from 'vue'
import type { WithEvents } from 'vue-typed-emit'
import type { WithRefs } from 'vue-typed-refs'

import type { Events, Refs, Thumbnail } from './types'
import { startsWith, isAspectRatio } from './helpers'
import {
  DEFAULT_ALT_ATTRIBUTE,
  DEFAULT_BUTTON_LABEL,
  PREVIEW_IMAGE_SIZES,
  DEFAULT_PREVIEW_IMAGE_SIZE,
  DEFAULT_ASPECT_RATIO,
  DEFAULT_IFRAME_ATTRIBUTES,
  YOUTUBE_REGEX,
  PLAYER_SCRIPT_SRC,
  PLAYER_CHECK_MS,
} from './constants'
import { Event } from './event'

export default (Vue as WithRefs<Refs, WithEvents<Events>>).extend({
  name: 'VueLazyYoutubeVideo',
  props: {
    src: {
      type: String,
      required: true,
      validator: (value) =>
        startsWith(value, 'https://www.youtube.com/embed/') ||
        startsWith(value, 'https://www.youtube-nocookie.com/embed/'),
    },
    alt: {
      type: String,
      default: DEFAULT_ALT_ATTRIBUTE,
    },
    buttonLabel: {
      type: String,
      default: DEFAULT_BUTTON_LABEL,
    },
    aspectRatio: {
      type: String,
      default: DEFAULT_ASPECT_RATIO,
      validator: isAspectRatio,
    },
    previewImageSize: {
      type: String,
      default: DEFAULT_PREVIEW_IMAGE_SIZE,
      validator: (value: any) => PREVIEW_IMAGE_SIZES.indexOf(value) !== -1,
    },
    thumbnail: {
      type: Object as PropType<Thumbnail>,
      validator: (val) => 'jpg' in val && 'webp' in val,
    },
    iframeAttributes: {
      type: Object as PropType<Record<string, string | boolean | number>>,
    },
    webp: {
      type: Boolean,
      default: true,
    },
    autoplay: {
      type: Boolean,
      default: false,
    },
    thumbnailListeners: {
      type: Object as PropType<Record<string, Function | Function[]>>,
    },
    enablejsapi: {
      type: Boolean,
      default: false,
    },
    playerOptions: {
      type: Object as PropType<YT.PlayerOptions>,
      default: () => ({}),
    },
    injectPlayerScript: {
      type: Boolean,
      default: false,
    },
    parameters: {
      type: Object as PropType<YT.PlayerVars>,
      default: () => ({}),
    },
  },
  data() {
    return {
      activated: this.autoplay,
      playerInstance: null as YT.Player | null,
      __interval__: null as number | null,
    }
  },
  computed: {
    id(): string {
      const executionResult = YOUTUBE_REGEX.exec(this.src)
      if (executionResult !== null) {
        return executionResult[1]
      } else {
        this.warn(`Failed to extract video id from ${this.src}`)
        return ''
      }
    },
    srcAttribute(): string {
      const hasQuestionMark = this.src.indexOf('?') !== -1
      const src = `${this.src}${hasQuestionMark ? '&' : '?'}${
        this.autoplay ? 'autoplay=1' : ''
      }${
        this.enablejsapi ? '&enablejsapi=1' : ''
      }`

      return Object.entries(this.parameters).reduce(
        (acc, [key, value]) => acc + `&${key}=${value}`,
        src
      )
    },
    styleObj(): object {
      return {
        paddingBottom: this.getPaddingBottom(),
      }
    },
  },
  methods: {
    clickHandler() {
      this.activated = true
    },
    getPaddingBottom() {
      let { aspectRatio } = this
      const warningMessage = `Invalid value ${aspectRatio} supplied to \`aspectRatio\` property, instead fallback value ${DEFAULT_ASPECT_RATIO} is used `

      if (
        typeof aspectRatio !== 'string' ||
        (typeof aspectRatio === 'string' &&
          isAspectRatio(aspectRatio) === false)
      ) {
        aspectRatio = DEFAULT_ASPECT_RATIO
        this.warn(warningMessage)
      }

      const [a, b] = aspectRatio.split(':').map(Number)
      return this.getPaddingBottomValue(a, b)
    },
    getPaddingBottomValue(a: number, b: number) {
      return `${(b / a) * 100}%`
    },
    onIframeLoad() {
      this.$emit(Event.LOAD_IFRAME, { iframe: this.$refs.iframe })

      if (this.enablejsapi) {
        try {
          window.YT.Player
          this.initPlayerInstance()
        } catch (e) {
          if (this.injectPlayerScript) {
            this.doInjectPlayerScript()
          } else {
            console.error(
              '[vue-lazy-youtube-video]: window.YT.Player is not defined. Make sure you either included the IFrame Player API or passed `injectPlayerScript` prop'
            )
            throw e
          }
        }
      }
    },
    checkPlayer() {
      if (YT.Player) {
        /* istanbul ignore else */
        if (this.__interval__) {
          clearInterval(this.__interval__)
        }

        this.initPlayerInstance()
        return true
      }
      return false
    },
    initPlayerInstance() {
      const { iframe } = this.$refs
      if (!iframe)
        throw new Error(
          '[vue-lazy-youtube-video]: YT.Player can not be instantiated without iframe element'
        )
      this.playerInstance = new YT.Player(iframe, this.playerOptions)
      this.$emit(Event.INIT_PLAYER, { instance: this.playerInstance })
      return this.playerInstance
    },
    getPlayerInstance() {
      return this.playerInstance
    },
    doInjectPlayerScript() {
      const script = document.createElement('script')
      script.setAttribute('src', PLAYER_SCRIPT_SRC)

      script.onload = () => {
        this.__interval__ = window.setInterval(() => {
          this.checkPlayer()
        }, PLAYER_CHECK_MS)
      }

      document.head.appendChild(script)
    },
    warn(message: string) {
      console.warn(`[vue-lazy-youtube-video]: ${message}`)
    },
    renderIframe(h: CreateElement) {
      return h('iframe', {
        ref: 'iframe',
        staticClass: 'y-video__media',
        attrs: {
          ...DEFAULT_IFRAME_ATTRIBUTES,
          ...this.iframeAttributes,
          src: this.srcAttribute,
        },
        on: { load: this.onIframeLoad },
      })
    },
    renderThumbnail(h: CreateElement) {
      return h('picture', {}, [
        this.webp
          ? h('source', {
              attrs: {
                srcset:
                  (this.thumbnail && this.thumbnail.webp) ||
                  `https://i.ytimg.com/vi_webp/${this.id}/${this.previewImageSize}.webp`,
                type: 'image/webp',
              },
            })
          : null,
        h('img', {
          staticClass: 'y-video__media y-video__media--type--img',
          attrs: {
            src:
              (this.thumbnail && this.thumbnail.jpg) ||
              `https://i.ytimg.com/vi/${this.id}/${this.previewImageSize}.jpg`,
            alt: this.alt,
          },
          on: this.thumbnailListeners,
        }),
      ])
    },
    renderButtonIcon(h: CreateElement) {
      return h(
        'svg',
        {
          attrs: {
            viewBox: '0 0 68 48',
            width: '100%',
            height: '100%',
          },
        },
        [
          h('path', {
            staticClass: 'y-video__button-shape',
            attrs: {
              d:
                'M66.5 7.7c-.8-2.9-2.5-5.4-5.4-6.2C55.8.1 34 0 34 0S12.2.1 6.9 1.6c-3 .7-4.6 3.2-5.4 6.1a89.6 89.6 0 0 0 0 32.5c.8 3 2.5 5.5 5.4 6.3C12.2 47.9 34 48 34 48s21.8-.1 27.1-1.6c3-.7 4.6-3.2 5.4-6.1C68 35 68 24 68 24s0-11-1.5-16.3z',
            },
          }),
          h('path', {
            staticClass: 'y-video__button-icon',
            attrs: { d: 'M45 24L27 14v20' },
          }),
        ]
      )
    },
  },
  render(h): VNode {
    return h(
      'div',
      {
        staticClass: 'y-video',
        on: { click: () => this.clickHandler() },
      },
      [
        h('div', { staticClass: 'y-video__inner', style: this.styleObj }, [
          this.activated
            ? this.renderIframe(h)
            : [
                this.renderThumbnail(h),
                this.$slots.button ||
                  h(
                    'button',
                    {
                      staticClass: 'y-video__button',
                      attrs: { type: 'button', 'aria-label': this.buttonLabel },
                    },
                    [this.$slots.icon || this.renderButtonIcon(h)]
                  ),
              ],
        ]),
      ]
    )
  },
})
