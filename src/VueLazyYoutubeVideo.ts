import Vue, { VNode } from 'vue'
import { LoadIframeEventPayload } from './types'
import { startsWith } from './helpers'
import { DEFAULT_IFRAME_ATTRIBUTES } from './constants'

export default Vue.extend({
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
      default: 'Video thumbnail',
    },
    buttonLabel: {
      type: String,
      default: 'Play video',
    },
    aspectRatio: {
      type: String,
      default: '16:9',
      validator: (value) => {
        const pattern = /^\d+:\d+$/
        return pattern.test(value)
      },
    },
    previewImageSize: {
      type: String,
      default: 'maxresdefault',
      validator: (value) =>
        [
          'default',
          'mqdefault',
          'sddefault',
          'hqdefault',
          'maxresdefault',
        ].indexOf(value) !== -1,
    },
    thumbnail: {
      type: Object as () => { webp: string; jpg: string },
      validator: (val) => 'jpg' in val && 'webp' in val,
    },
    iframeAttributes: {
      type: Object as () => {},
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
      type: Object as () => Record<string, Function | Function[]>,
    },
  },
  data(): { activated: boolean } {
    const self = this
    return {
      activated: self.autoplay,
    }
  },
  computed: {
    id(): string {
      const regExp = /^https:\/\/www\.youtube(?:-nocookie)?\.com\/embed\/(.+?)(?:\?.*)?$/
      const executionResult = regExp.exec(this.src)
      if (executionResult !== null) {
        return executionResult[1]
      } else {
        this.warn(`Failed to extract video id from ${this.src}`)
        return ''
      }
    },
    srcAttribute(): string {
      const hasQuestionMark =
        typeof this.src === 'string' && this.src.indexOf('?') !== -1
      return `${this.src}${hasQuestionMark ? '&' : '?'}autoplay=1`
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
      // Vue does not provide correct typescript support
      // @ts-ignore
      const defaultAspectRatio = this.$options.props.aspectRatio.default
      const warningMessage = `Invalid value ${aspectRatio} supplied to \`aspectRatio\` property, instead fallback value ${defaultAspectRatio} is used `

      if (typeof aspectRatio === 'string') {
        const [a, b] = aspectRatio.split(':').map(Number)

        if (isFinite(a) === true && isFinite(b) === true) {
        } else {
          aspectRatio = defaultAspectRatio
          this.warn(warningMessage)
        }
      } else {
        aspectRatio = defaultAspectRatio
        this.warn(warningMessage)
      }

      const [a, b] = aspectRatio.split(':').map(Number)
      return this.getPaddingBottomValue(a, b)
    },
    getPaddingBottomValue(a: number, b: number) {
      return `${(b / a) * 100}%`
    },
    onIframeLoad() {
      const payload: LoadIframeEventPayload = { iframe: this.getIframe() }
      this.$emit('load:iframe', payload)
    },
    getIframe() {
      return this.$refs.iframe as HTMLIFrameElement | undefined
    },
    warn(message: string) {
      console.warn(`[vue-lazy-youtube-video]: ${message}`)
    },
  },
  render(h): VNode {
    const {
      alt,
      buttonLabel,
      previewImageSize,
      thumbnail,
      iframeAttributes,
      webp,
      activated,
      id,
      srcAttribute,
      styleObj,
    } = this

    return h(
      'div',
      {
        staticClass: 'y-video',
        on: { click: () => this.clickHandler() },
      },
      [
        h('div', { staticClass: 'y-video__inner', style: styleObj }, [
          activated
            ? h('iframe', {
                ref: 'iframe',
                staticClass: 'y-video__media',
                attrs: {
                  ...DEFAULT_IFRAME_ATTRIBUTES,
                  ...iframeAttributes,
                  src: srcAttribute,
                },
                on: { load: this.onIframeLoad },
              })
            : [
                h('picture', {}, [
                  webp
                    ? h('source', {
                        attrs: {
                          srcset:
                            (thumbnail && thumbnail.webp) ||
                            `https://i.ytimg.com/vi_webp/${id}/${previewImageSize}.webp`,
                          type: 'image/webp',
                        },
                      })
                    : null,
                  h('img', {
                    staticClass: 'y-video__media y-video__media--type--img',
                    attrs: {
                      src:
                        (thumbnail && thumbnail.jpg) ||
                        `https://i.ytimg.com/vi/${id}/${previewImageSize}.jpg`,
                      alt,
                    },
                    on: this.thumbnailListeners,
                  }),
                ]),
                this.$slots.button ||
                  h(
                    'button',
                    {
                      staticClass: 'y-video__button',
                      attrs: { type: 'button', 'aria-label': buttonLabel },
                    },
                    [
                      this.$slots.icon ||
                        h(
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
                        ),
                    ]
                  ),
              ],
        ]),
      ]
    )
  },
})
