import Vue from 'vue'
import type { PropType, CreateElement, VNode } from 'vue'
import type { WithEvents } from 'vue-typed-emit'
import type { WithRefs } from 'vue-typed-refs'

import type { Undefined, Events, Refs, Thumbnail, ThumnailSize } from './types'
import { THUMBNAIL_SIZES } from './types'
import { startsWith, isAspectRatio, getThumbnailSize } from './helpers'
import {
  DEFAULT_ALT_ATTRIBUTE,
  DEFAULT_BUTTON_LABEL,
  THUMBNAIL_SIZE,
  DEFAULT_ASPECT_RATIO,
  DEFAULT_IFRAME_ATTRIBUTES,
  YOUTUBE_REGEX,
  LOOM_REGEX,
  PLAYER_SCRIPT_SRC,
  PLAYER_CHECK_MS,
} from './constants'
import { EventName } from './event'

export default (Vue as WithRefs<Refs, WithEvents<Events>>).extend({
  name: 'VueLazyYoutubeVideo',
  props: {
    src: {
      type: String,
      required: true,
      validator: (value) =>
        startsWith(value, 'https://www.youtube.com/embed/') ||
        startsWith(value, 'https://www.youtube-nocookie.com/embed/') ||
        startsWith(value, 'https://www.loom.com/embed/'),
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
      default: undefined,
      validator: (value: any) => THUMBNAIL_SIZES.indexOf(value) !== -1,
    },
    thumbnail: {
      type: Object as PropType<Thumbnail>,
      validator: (val) => 'jpg' in val,
      default: null,
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
      default: null,
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
      width: 0,
      thumbnailSizeOverride: undefined as Undefined<ThumnailSize>,
    }
  },
  computed: {
    id(): string {
      var executionResult = null
      if (startsWith(this.src, 'https://www.loom.com/embed/')){
        executionResult = LOOM_REGEX.exec(this.src)
      }
      else{
        executionResult = YOUTUBE_REGEX.exec(this.src)
      }
      if (executionResult !== null) {
        return executionResult[1]
      } else {
        this.warn(`Failed to extract video id from ${this.src}`)
        return ''
      }
    },
    srcAttribute(): string {
      const hasQuestionMark = this.src.indexOf('?') !== -1
      const src = `${this.src}${hasQuestionMark ? '&' : '?'}autoplay=1${
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
    thumbnailSize(): Undefined<ThumnailSize> {
      if (this.previewImageSize) return this.previewImageSize
      if (this.thumbnailSizeOverride !== undefined)
        return this.thumbnailSizeOverride
      if (this.width === 0) return undefined
      let ratio = 1
      if (window !== undefined) {
        ratio = window.devicePixelRatio
      }
      return getThumbnailSize(this.width * ratio)
    },
  },
  mounted() {
    this.width = (this.$el as HTMLElement).clientWidth
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
      this.$emit(EventName.LOAD_IFRAME, { iframe: this.$refs.iframe })

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
      this.$emit(EventName.INIT_PLAYER, { instance: this.playerInstance })
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
    onThumbnailLoad(e: Event) {
      if (
        this.thumbnailListeners !== null &&
        typeof this.thumbnailListeners.load === 'function'
      ) {
        this.thumbnailListeners.load(e)
      }
      if (this.thumbnail !== null) return
      if (this.thumbnailSize === undefined) return
      if (
        THUMBNAIL_SIZE[this.thumbnailSize] !==
        (e.target as HTMLImageElement).naturalWidth
      ) {
        const index = Math.max(
          THUMBNAIL_SIZES.indexOf(this.thumbnailSize) - 1,
          0
        )
        this.thumbnailSizeOverride = THUMBNAIL_SIZES[index]
      }
    },
    renderYoutubeThumbnail(h: CreateElement) {
      if (this.thumbnail === null && this.thumbnailSize === undefined) {
        return null
      }
      return h('picture', undefined, [
        this.webp &&
        (this.thumbnail === null ||
          (this.thumbnail !== null && this.thumbnail.webp))
          ? h('source', {
              attrs: {
                srcset:
                  this.thumbnail !== null && this.thumbnail.webp
                    ? this.thumbnail.webp
                    : `https://i.ytimg.com/vi_webp/${this.id}/${this.thumbnailSize}.webp`,
                type: 'image/webp',
              },
            })
          : null,
        h('img', {
          staticClass: 'y-video__media y-video__media--type--img',
          attrs: {
            src:
              this.thumbnail !== null && this.thumbnail.jpg
                ? this.thumbnail.jpg
                : `https://i.ytimg.com/vi/${this.id}/${this.thumbnailSize}.jpg`,
            alt: this.alt,
          },
          on: {
            ...this.thumbnailListeners,
            load: this.onThumbnailLoad,
          },
        }),
      ])
    },
    renderLoomThumbnail(h: CreateElement){
      return h('picture', {}, [
        h('img', {
          staticClass: 'y-video__media y-video__media--type--img',
          attrs: {
            src:
              (this.thumbnail && this.thumbnail.jpg) ||
              `https://cdn.loom.com/sessions/thumbnails/${this.id}-00001.jpg`,
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
              d: 'M66.5 7.7c-.8-2.9-2.5-5.4-5.4-6.2C55.8.1 34 0 34 0S12.2.1 6.9 1.6c-3 .7-4.6 3.2-5.4 6.1a89.6 89.6 0 0 0 0 32.5c.8 3 2.5 5.5 5.4 6.3C12.2 47.9 34 48 34 48s21.8-.1 27.1-1.6c3-.7 4.6-3.2 5.4-6.1C68 35 68 24 68 24s0-11-1.5-16.3z',
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
                startsWith(this.src, 'https://www.loom.com/embed/') ? this.renderLoomThumbnail(h) : this.renderYoutubeThumbnail(h),
                // this.renderThumbnail(h),
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
