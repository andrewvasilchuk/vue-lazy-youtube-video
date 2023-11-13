(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('vue')) :
    typeof define === 'function' && define.amd ? define(['exports', 'vue'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.VueLazyYoutubeVideo = {}, global.Vue));
})(this, (function (exports, Vue) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var Vue__default = /*#__PURE__*/_interopDefaultLegacy(Vue);

    /**
     * @see https://stackoverflow.com/a/30867255/11761617
     */
    function startsWith(string, value, position = 0) {
        return string.indexOf(value, position) === position;
    }
    function isAspectRatio(value) {
        return /^\d+:\d+$/.test(value);
    }

    const DEFAULT_ALT_ATTRIBUTE = 'Video thumbnail';
    const DEFAULT_BUTTON_LABEL = 'Play video';
    const DEFAULT_ASPECT_RATIO = '16:9';
    const PREVIEW_IMAGE_SIZES = [
        'default',
        'mqdefault',
        'sddefault',
        'hqdefault',
        'maxresdefault',
    ];
    const DEFAULT_PREVIEW_IMAGE_SIZE = PREVIEW_IMAGE_SIZES[4];
    const DEFAULT_IFRAME_ATTRIBUTES = {
        allowfullscreen: true,
        frameborder: 0,
        allow: 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture',
    };
    const YOUTUBE_REGEX = /^https:\/\/www\.youtube(?:-nocookie)?\.com\/embed\/(.+?)(?:\?.*)?$/;
    const LOOM_REGEX = /^https:\/\/www\.loom\.com\/embed\/(.+?)(?:\?.*)?$/;
    const PLAYER_SCRIPT_SRC = 'https://www.youtube.com/player_api';
    const PLAYER_CHECK_MS = 32;

    var Event;
    (function (Event) {
        Event["LOAD_IFRAME"] = "load:iframe";
        Event["INIT_PLAYER"] = "init:player";
    })(Event || (Event = {}));

    var VueLazyYoutubeVideo = Vue__default["default"].extend({
        name: 'VueLazyYoutubeVideo',
        props: {
            src: {
                type: String,
                required: true,
                validator: (value) => startsWith(value, 'https://www.youtube.com/embed/') ||
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
                default: DEFAULT_PREVIEW_IMAGE_SIZE,
                validator: (value) => PREVIEW_IMAGE_SIZES.indexOf(value) !== -1,
            },
            thumbnail: {
                type: Object,
                validator: (val) => 'jpg' in val && 'webp' in val,
            },
            iframeAttributes: {
                type: Object,
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
                type: Object,
            },
            enablejsapi: {
                type: Boolean,
                default: false,
            },
            playerOptions: {
                type: Object,
                default: () => ({}),
            },
            injectPlayerScript: {
                type: Boolean,
                default: false,
            },
            parameters: {
                type: Object,
                default: () => ({}),
            },
        },
        data() {
            return {
                activated: this.autoplay,
                playerInstance: null,
                __interval__: null,
            };
        },
        computed: {
            id() {
                var executionResult = null;
                if (startsWith(this.src, 'https://www.loom.com/embed/')) {
                    executionResult = LOOM_REGEX.exec(this.src);
                }
                else {
                    executionResult = YOUTUBE_REGEX.exec(this.src);
                }
                if (executionResult !== null) {
                    return executionResult[1];
                }
                else {
                    this.warn(`Failed to extract video id from ${this.src}`);
                    return '';
                }
            },
            srcAttribute() {
                const hasQuestionMark = this.src.indexOf('?') !== -1;
                const src = `${this.src}${hasQuestionMark ? '&' : '?'}autoplay=1${this.enablejsapi ? '&enablejsapi=1' : ''}`;
                return Object.entries(this.parameters).reduce((acc, [key, value]) => acc + `&${key}=${value}`, src);
            },
            styleObj() {
                return {
                    paddingBottom: this.getPaddingBottom(),
                };
            },
        },
        methods: {
            clickHandler() {
                this.activated = true;
            },
            getPaddingBottom() {
                let { aspectRatio } = this;
                const warningMessage = `Invalid value ${aspectRatio} supplied to \`aspectRatio\` property, instead fallback value ${DEFAULT_ASPECT_RATIO} is used `;
                if (typeof aspectRatio !== 'string' ||
                    (typeof aspectRatio === 'string' &&
                        isAspectRatio(aspectRatio) === false)) {
                    aspectRatio = DEFAULT_ASPECT_RATIO;
                    this.warn(warningMessage);
                }
                const [a, b] = aspectRatio.split(':').map(Number);
                return this.getPaddingBottomValue(a, b);
            },
            getPaddingBottomValue(a, b) {
                return `${(b / a) * 100}%`;
            },
            onIframeLoad() {
                this.$emit(Event.LOAD_IFRAME, { iframe: this.$refs.iframe });
                if (this.enablejsapi) {
                    try {
                        window.YT.Player;
                        this.initPlayerInstance();
                    }
                    catch (e) {
                        if (this.injectPlayerScript) {
                            this.doInjectPlayerScript();
                        }
                        else {
                            console.error('[vue-lazy-youtube-video]: window.YT.Player is not defined. Make sure you either included the IFrame Player API or passed `injectPlayerScript` prop');
                            throw e;
                        }
                    }
                }
            },
            checkPlayer() {
                if (YT.Player) {
                    /* istanbul ignore else */
                    if (this.__interval__) {
                        clearInterval(this.__interval__);
                    }
                    this.initPlayerInstance();
                    return true;
                }
                return false;
            },
            initPlayerInstance() {
                const { iframe } = this.$refs;
                if (!iframe)
                    throw new Error('[vue-lazy-youtube-video]: YT.Player can not be instantiated without iframe element');
                this.playerInstance = new YT.Player(iframe, this.playerOptions);
                this.$emit(Event.INIT_PLAYER, { instance: this.playerInstance });
                return this.playerInstance;
            },
            getPlayerInstance() {
                return this.playerInstance;
            },
            doInjectPlayerScript() {
                const script = document.createElement('script');
                script.setAttribute('src', PLAYER_SCRIPT_SRC);
                script.onload = () => {
                    this.__interval__ = window.setInterval(() => {
                        this.checkPlayer();
                    }, PLAYER_CHECK_MS);
                };
                document.head.appendChild(script);
            },
            warn(message) {
                console.warn(`[vue-lazy-youtube-video]: ${message}`);
            },
            renderIframe(h) {
                return h('iframe', {
                    ref: 'iframe',
                    staticClass: 'y-video__media',
                    attrs: {
                        ...DEFAULT_IFRAME_ATTRIBUTES,
                        ...this.iframeAttributes,
                        src: this.srcAttribute,
                    },
                    on: { load: this.onIframeLoad },
                });
            },
            renderYoutubeThumbnail(h) {
                return h('picture', {}, [
                    this.webp
                        ? h('source', {
                            attrs: {
                                srcset: (this.thumbnail && this.thumbnail.webp) ||
                                    `https://i.ytimg.com/vi_webp/${this.id}/${this.previewImageSize}.webp`,
                                type: 'image/webp',
                            },
                        })
                        : null,
                    h('img', {
                        staticClass: 'y-video__media y-video__media--type--img',
                        attrs: {
                            src: (this.thumbnail && this.thumbnail.jpg) ||
                                `https://i.ytimg.com/vi/${this.id}/${this.previewImageSize}.jpg`,
                            alt: this.alt,
                        },
                        on: this.thumbnailListeners,
                    }),
                ]);
            },
            renderLoomThumbnail(h) {
                return h('picture', {}, [
                    h('img', {
                        staticClass: 'y-video__media y-video__media--type--img',
                        attrs: {
                            src: (this.thumbnail && this.thumbnail.jpg) ||
                                `https://cdn.loom.com/sessions/thumbnails/${this.id}-00001.jpg`,
                            alt: this.alt,
                        },
                        on: this.thumbnailListeners,
                    }),
                ]);
            },
            renderButtonIcon(h) {
                return h('svg', {
                    attrs: {
                        viewBox: '0 0 68 48',
                        width: '100%',
                        height: '100%',
                    },
                }, [
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
                ]);
            },
        },
        render(h) {
            return h('div', {
                staticClass: 'y-video',
                on: { click: () => this.clickHandler() },
            }, [
                h('div', { staticClass: 'y-video__inner', style: this.styleObj }, [
                    this.activated
                        ? this.renderIframe(h)
                        : [
                            startsWith(this.src, 'https://www.loom.com/embed/') ? this.renderLoomThumbnail(h) : this.renderYoutubeThumbnail(h),
                            // this.renderThumbnail(h),
                            this.$slots.button ||
                                h('button', {
                                    staticClass: 'y-video__button',
                                    attrs: { type: 'button', 'aria-label': this.buttonLabel },
                                }, [this.$slots.icon || this.renderButtonIcon(h)]),
                        ],
                ]),
            ]);
        },
    });

    const Plugin = {
        install(Vue) {
            Vue.component('LazyYoutubeVideo', VueLazyYoutubeVideo);
        },
    };

    exports.Plugin = Plugin;
    exports["default"] = VueLazyYoutubeVideo;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
