import {
  DEFAULT_ALT_ATTRIBUTE,
  DEFAULT_ASPECT_RATIO,
  DEFAULT_IFRAME_ATTRIBUTES,
  PLAYER_CHECK_MS,
  DEFAULT_BUTTON_LABEL,
  PREVIEW_IMAGE_SIZES,
  DEFAULT_PREVIEW_IMAGE_SIZE,
} from '../src/constants'
import { Event } from '../src/event'

import { classes } from './config'
import { defaultProps, getDefaultProps, VIDEO_ID } from './fixtures'
import { TestManager } from './helpers'

describe('VueLazyYoutubeVideo', () => {
  it('should insert `<iframe />` into the DOM when clicked', async () => {
    const wrapper = TestManager.createWrapper()
    const iframe = await TestManager.clickAndGetIframe(wrapper)
    expect(iframe.exists()).toBeTruthy()
  })

  it('should remove button and thumbnail when clicked', async () => {
    const wrapper = TestManager.createWrapper()
    await TestManager.clickAndGetIframe(wrapper)
    expect(wrapper.find(classes.button).exists()).toBeFalsy()
    expect(wrapper.find('picture').exists()).toBeFalsy()
  })

  describe('props', () => {
    describe('src', () => {
      it('should correctly set `src` attribute of the `<iframe />` element', async () => {
        let wrapper = TestManager.createWrapper()
        let iframe = await TestManager.clickAndGetIframe(wrapper)
        expect(iframe.element.getAttribute('src')).toBe(
          `${defaultProps.src}`
        )
        const query = '?loop=1'
        wrapper = TestManager.createWrapper({
          propsData: getDefaultProps({ query }),
        })
        iframe = await TestManager.clickAndGetIframe(wrapper)
        expect(iframe.element.getAttribute('src')).toBe(
          `${defaultProps.src}${query}`
        )
      })

      it('should be `String`, required and be validated', (done) => {
        const definition = TestManager.getPropDefinition('src')
        expect(definition).toMatchObject({
          type: String,
          required: true,
        })

        if (typeof definition === 'object' && !Array.isArray(definition)) {
          const { validator } = definition
          if (validator) {
            expect(validator('INVALID_VALUE')).toBeFalsy()
            expect(
              validator('https://www.youtube.com/embed/4JS70KB9GS0')
            ).toBeTruthy()
            expect(
              validator('https://www.youtube-nocookie.com/embed/4JS70KB9GS0')
            ).toBeTruthy()
            done()
          } else {
            done.fail('Invalid prop definition')
          }
        } else {
          done.fail('Invalid prop definition')
        }
      })
    })

    describe('aspectRatio', () => {
      it(`should correctly set \`padding bottom\` of the \`<element class="${classes.inner}"></element>\` when no value is passed`, () => {
        const wrapper = TestManager.createWrapper()
        expect(wrapper.find(classes.inner).element.style.paddingBottom).toBe(
          `${(9 / 16) * 100}%`
        )
      })

      it(`should correctly set \`padding bottom\` of the \`<element class="${classes.inner}"></element>\` when valid value is passed`, () => {
        const [a, b] = [4, 3]
        const wrapper = TestManager.createWrapper({
          propsData: { aspectRatio: `${a}:${b}` },
        })
        expect(wrapper.find(classes.inner).element.style.paddingBottom).toBe(
          `${(b / a) * 100}%`
        )
      })

      it(`should correctly set \`padding bottom\` of the \`<element class="${classes.inner}"></element>\` when invalid value is passed`, () => {
        const invalid = ['foo']
        invalid.forEach((value) => {
          const wrapper = TestManager.createWrapper({
            propsData: { aspectRatio: value },
          })
          expect(wrapper.find(classes.inner).element.style.paddingBottom).toBe(
            `${(9 / 16) * 100}%`
          )
        })
      })

      it('should be `String` have default value and be validated', () => {
        const definition = TestManager.getPropDefinition('aspectRatio')
        expect(definition).toMatchObject({
          type: String,
          default: DEFAULT_ASPECT_RATIO,
        })

        if (typeof definition === 'object' && !Array.isArray(definition)) {
          const { validator } = definition
          if (validator) {
            expect(validator('INVALID_VALUE')).toBeFalsy()
            expect(validator('4:3')).toBeTruthy()
          } else {
            throw new Error()
          }
        } else {
          throw new Error()
        }
      })
    })

    describe('alt', () => {
      it('should correctly set `alt` attribute of the preview `<img />` when valid value is passed', () => {
        const alt = 'foo'
        const wrapper = TestManager.createWrapper({
          propsData: { alt },
        })
        expect(wrapper.find('img').element.getAttribute('alt')).toBe(alt)
      })

      it('should be `String` and have default value', () => {
        const definition = TestManager.getPropDefinition('alt')
        expect(definition).toMatchObject({
          type: String,
          default: DEFAULT_ALT_ATTRIBUTE,
        })
      })

      it('should correctly set `alt` attribute of the preview `<img />` when no value is passed', () => {
        const wrapper = TestManager.createWrapper()
        expect(wrapper.find('img').element.getAttribute('alt')).toBe(
          DEFAULT_ALT_ATTRIBUTE
        )
      })
    })

    describe('buttonLabel', () => {
      it('should correctly set `aria-label` attribute of the `<button></button>` when no value is passed', () => {
        const wrapper = TestManager.createWrapper()
        expect(
          wrapper.find(classes.button).element.getAttribute('aria-label')
        ).toBe(DEFAULT_BUTTON_LABEL)
      })

      it('should correctly set `aria-label` attribute of the `<button></button>` when valid value is passed', () => {
        const buttonLabel = 'Simple dummy text'
        const wrapper = TestManager.createWrapper({
          propsData: { buttonLabel },
        })
        expect(
          wrapper.find(classes.button).element.getAttribute('aria-label')
        ).toBe(buttonLabel)
      })

      it('should be `String` and have default value', () => {
        const definition = TestManager.getPropDefinition('buttonLabel')
        expect(definition).toMatchObject({
          type: String,
          default: DEFAULT_BUTTON_LABEL,
        })
      })
    })

    describe('previewImageSize', () => {
      it('should correctly set `srcset` and `src` attributes of `<source />` and `<img />` when valid value is passed', (done) => {
        const previewImageSize = PREVIEW_IMAGE_SIZES[0]
        const wrapper = TestManager.createWrapper({
          propsData: {
            previewImageSize,
          },
        })
        const { img, source } = TestManager.getImgAndSourceElements(wrapper)
        const srcAttribute = img.getAttribute('src')
        const srcsetAttribute = source.getAttribute('srcset')

        if (srcAttribute !== null) {
          expect(srcAttribute).toBe(
            `https://i.ytimg.com/vi/${VIDEO_ID}/${previewImageSize}.jpg`
          )
        } else {
          done.fail('Invalid `src` attribute')
        }
        if (srcsetAttribute !== null) {
          expect(srcsetAttribute).toBe(
            `https://i.ytimg.com/vi_webp/${VIDEO_ID}/${previewImageSize}.webp`
          )
        } else {
          done.fail('Invalid `srcset` attribute')
        }

        done()
      })

      it('should correctly set `srcset` and `src` attributes of `<source />` and `<img />` when no value is passed', () => {
        const wrapper = TestManager.createWrapper()
        const { img, source } = TestManager.getImgAndSourceElements(wrapper)
        const srcAttribute = img.getAttribute('src')
        const srcsetAttribute = source.getAttribute('srcset')

        if (srcAttribute) {
          expect(srcAttribute).toBe(
            `https://i.ytimg.com/vi/${VIDEO_ID}/${DEFAULT_PREVIEW_IMAGE_SIZE}.jpg`
          )
        }

        if (srcsetAttribute) {
          expect(srcsetAttribute).toBe(
            `https://i.ytimg.com/vi_webp/${VIDEO_ID}/${DEFAULT_PREVIEW_IMAGE_SIZE}.webp`
          )
        }
      })

      it('should be `String` have default value and be validated', (done) => {
        const definition = TestManager.getPropDefinition('previewImageSize')
        expect(definition).toMatchObject({
          type: String,
          default: 'maxresdefault',
        })

        if (typeof definition === 'object' && !Array.isArray(definition)) {
          const { validator } = definition
          if (validator) {
            expect(validator('INVALID_VALUE')).toBeFalsy()
            expect(validator(PREVIEW_IMAGE_SIZES[0])).toBeTruthy()
          } else {
            done.fail('Invalid validator definition')
          }
        } else {
          done.fail('Invalid validator definition')
        }

        done()
      })
    })

    describe('thumbnail', () => {
      it('should correctly set `srcset` and `src` attributes of thumbnails when valid value is passed', () => {
        const thumbnail = { webp: 'w', jpg: 'j' }
        const wrapper = TestManager.createWrapper({ propsData: { thumbnail } })
        const { img, source } = TestManager.getImgAndSourceElements(wrapper)
        expect(source.getAttribute('srcset')).toEqual(thumbnail.webp)
        expect(img.getAttribute('src')).toEqual(thumbnail.jpg)
      })

      it('should be `Object` and be validated', (done) => {
        const definition = TestManager.getPropDefinition('thumbnail')
        expect(definition).toMatchObject({
          type: Object,
        })

        if (typeof definition === 'object' && !Array.isArray(definition)) {
          const { validator } = definition
          if (validator) {
            expect(validator({ jpg: 'j', webp: 'w' })).toBeTruthy()
            done()
          } else {
            done.fail('Invalid validator definition')
          }
        } else {
          done.fail('Invalid validator definition')
        }
      })
    })

    describe('iframeAttributes', () => {
      it('should correctly set attributes of the `<iframe />` when valid value is passed', async (done) => {
        const iframeAttributes = { foo: 'bar', baz: 'vue' }
        const wrapper = TestManager.createWrapper({
          propsData: { iframeAttributes },
        })
        const iframe = await TestManager.clickAndGetIframe(wrapper)

        Object.entries({
          ...DEFAULT_IFRAME_ATTRIBUTES,
          ...iframeAttributes,
        }).forEach(([key, value]) => {
          const attribute = iframe.element.getAttribute(key)

          if (attribute !== null) {
            expect([value, attribute]).toContain(value)
          } else {
            done.fail()
          }
        })

        done()
      })

      it('should correctly set attributes of the `<iframe />` element when no value is passed', async (done) => {
        const wrapper = TestManager.createWrapper()
        const iframe = await TestManager.clickAndGetIframe(wrapper)
        Object.entries(DEFAULT_IFRAME_ATTRIBUTES).forEach(([key, value]) => {
          const attribute = iframe.element.getAttribute(key)
          if (attribute !== null) {
            expect([value, attribute]).toContain(value)
          } else {
            done.fail()
          }
        })
        done()
      })

      it('should be `Object`', () => {
        const definition = TestManager.getPropDefinition('iframeAttributes')
        expect(definition).toMatchObject({
          type: Object,
        })
      })
    })

    describe('webp', () => {
      it('should not render `<source />` element when `false` is passed', () => {
        const wrapper = TestManager.createWrapper({
          propsData: { webp: false },
        })
        const source = wrapper.find('source')
        expect(source.exists()).toBeFalsy()
      })

      it('should render `<source />` element when `true` is passed', () => {
        const wrapper = TestManager.createWrapper({ propsData: { webp: true } })
        const source = wrapper.find('source')
        expect(source.exists()).toBeTruthy()
      })

      it('should be `Boolean` and have default value', () => {
        const definition = TestManager.getPropDefinition('webp')
        expect(definition).toMatchObject({
          type: Boolean,
          default: true,
        })
      })
    })

    describe('autoplay', () => {
      it('should set initial value of `activated` data property', () => {
        const autoplay = true
        const wrapper = TestManager.createWrapper({ propsData: { autoplay } })
        expect(wrapper.vm.activated).toBe(autoplay)
      })

      it('should be `Boolean` and have default value', () => {
        const definition = TestManager.getPropDefinition('autoplay')
        expect(definition).toMatchObject({
          type: Boolean,
          default: false,
        })
      })
    })

    describe('thumbnailListeners', () => {
      it('should bind passed listeners', () => {
        const click = jest.fn()
        const wrapper = TestManager.createWrapper({
          propsData: { thumbnailListeners: { click } },
        })
        const img = wrapper.find('img')
        img.element.click()
        expect(click).toHaveBeenCalledTimes(1)
      })

      it('should be `Object`', () => {
        const definition = TestManager.getPropDefinition('thumbnailListeners')
        expect(definition).toMatchObject({
          type: Object,
        })
      })
    })

    describe('playerOptions', () => {
      beforeEach(() => {
        TestManager.mockGlobalPlayer()
      })

      afterEach(() => {
        TestManager.cleanGlobalPlayer()
      })

      it('should pass options to `YT.Player` constructor', async () => {
        const options: YT.PlayerOptions = { width: 256 }
        const wrapper = TestManager.createWrapper({
          propsData: { enablejsapi: true, playerOptions: options },
        })
        await TestManager.play(wrapper)
        expect(TestManager.getMockedPlayer()).toHaveBeenCalledWith(
          TestManager.getIframeElement(wrapper),
          options
        )
      })

      it('should be `Object` and have default value', (done) => {
        const definition = TestManager.getPropDefinition('playerOptions')
        expect(definition).toMatchObject({
          type: Object,
        })
        if (typeof definition === 'object' && !Array.isArray(definition)) {
          const { default: d } = definition
          if (d && typeof d === 'function') {
            expect(d()).toMatchObject({})
            done()
          } else {
            done.fail('Invalid prop definition')
          }
        } else {
          done.fail('Invalid prop definition')
        }
      })
    })

    describe('injectPlayerScript', () => {
      it('should inject `<script />` tag when passed', async () => {
        const wrapper = TestManager.createWrapper({
          propsData: { enablejsapi: true, injectPlayerScript: true },
        })
        await TestManager.play(wrapper)
        expect(TestManager.getScriptElement()).not.toBe(null)
        TestManager.cleanScriptElement()
      })

      it('should handle `<script />` `"onload"` event, wait for YT.Player availability and therefore instantiate a player instance', async (done) => {
        const wrapper = TestManager.createWrapper({
          propsData: { enablejsapi: true, injectPlayerScript: true },
        })
        await TestManager.play(wrapper)
        expect(wrapper.vm.playerInstance).toBeNull()
        const script = TestManager.getScriptElement()
        if (script !== null) {
          if (script.onload !== null) {
            script.onload(new window.Event('load'))
            global.YT = {}
            setTimeout(() => {
              TestManager.mockGlobalPlayer()
            }, PLAYER_CHECK_MS)
            setTimeout(() => {
              expect(wrapper.vm.playerInstance).toBe(
                TestManager.getMockedPlayer().mock.instances[0]
              )
              TestManager.cleanGlobalPlayer()
              TestManager.cleanScriptElement()
              done()
            }, PLAYER_CHECK_MS * 3)
          } else {
            done.fail('`<script />` onload callback is not provided')
          }
        } else {
          done.fail('`<script />` is `null`')
        }
      })

      it('should throw if is set to `false` and there ins no `YT.Player` in `global`', async () => {
        const spy = jest.spyOn(console, 'error').mockImplementation()
        const wrapper = TestManager.createWrapper({
          propsData: { enablejsapi: true, injectPlayerScript: false },
        })
        expect(() => wrapper.vm.onIframeLoad()).toThrow()
        spy.mockRestore()
      })

      it('should be `Boolean` and have default value', () => {
        const definition = TestManager.getPropDefinition('injectPlayerScript')
        expect(definition).toMatchObject({
          type: Boolean,
          default: false,
        })
      })
    })

    describe('parameters', () => {
      it('should correctly set `parameters` to `src` attribute of the `<iframe />` element', async () => {
        const parameters = { rel: 0, color: 'white' as const }
        const wrapper = TestManager.createWrapper({
          propsData: { parameters },
        })
        const iframe = await TestManager.clickAndGetIframe(wrapper)
        expect(iframe.element.getAttribute('src')).toBe(
          `${defaultProps.src}?rel=0&color=white`
        )
      })

      it('should be `Object` and have default value', (done) => {
        const definition = TestManager.getPropDefinition('parameters')
        expect(definition).toMatchObject({
          type: Object,
        })
        if (typeof definition === 'object' && !Array.isArray(definition)) {
          const { default: d } = definition
          if (d && typeof d === 'function') {
            expect(d()).toMatchObject({})
            done()
          } else {
            done.fail('Invalid prop definition')
          }
        } else {
          done.fail('Invalid prop definition')
        }
      })
    })
  })

  describe('events', () => {
    describe(Event.LOAD_IFRAME, () => {
      it("should emit event when `<iframe />`' `load` event happens", async () => {
        const wrapper = TestManager.createWrapper()
        await TestManager.play(wrapper)
        const emitted = wrapper.emitted(Event.LOAD_IFRAME)
        if (emitted) {
          expect(emitted.length).toBe(1)
        }
      })

      it('should provide correct payload', async () => {
        const wrapper = TestManager.createWrapper()
        await TestManager.play(wrapper)
        const emitted = wrapper.emitted()[Event.LOAD_IFRAME]
        if (emitted) {
          expect(emitted[0][0].iframe).toEqual(
            TestManager.getIframeElement(wrapper)
          )
        }
      })
    })

    describe(Event.INIT_PLAYER, () => {
      beforeEach(() => {
        TestManager.mockGlobalPlayer()
      })

      afterEach(() => {
        TestManager.cleanGlobalPlayer()
      })

      it('should emit when `YT.Player` is instantiated', async () => {
        const wrapper = TestManager.createWrapper({
          propsData: { enablejsapi: true },
        })
        await TestManager.play(wrapper)
        const emitted = wrapper.emitted(Event.INIT_PLAYER)
        if (emitted) {
          expect(emitted.length).toBe(1)
        }
      })

      it('should provide correct payload', async () => {
        const wrapper = TestManager.createWrapper({
          propsData: { enablejsapi: true },
        })
        await TestManager.play(wrapper)
        const emitted = wrapper.emitted(Event.INIT_PLAYER)
        if (emitted) {
          expect(emitted[0][0].instance).toEqual(
            TestManager.getMockedPlayer().mock.instances[0]
          )
        }
      })
    })
  })

  describe('slots', () => {
    describe('icon', () => {
      it('should render when passed', async () => {
        const icon = '<svg><g></g></svg>'
        const wrapper = TestManager.createWrapper({ slots: { icon } })
        expect(wrapper.find(classes.button).element.innerHTML).toBe(icon)
      })
    })

    describe('button', () => {
      it('should render when passed', async () => {
        const button = '<button type="button">foo</button>'
        const wrapper = TestManager.createWrapper({ slots: { button } })
        expect(wrapper.find('button').element.outerHTML).toBe(button)
      })
    })
  })

  describe('computed', () => {
    describe('id', () => {
      it('should warn for unsuccessful id extraction', () => {
        const errorSpy = jest.spyOn(console, 'error').mockImplementation()
        const src = 'INVALID_SRC'
        const warnSpy = jest.spyOn(global.console, 'warn').mockImplementation()
        TestManager.createWrapper({
          propsData: { src },
        })
        expect(warnSpy).toHaveBeenCalledTimes(1)
        errorSpy.mockRestore()
        warnSpy.mockRestore()
      })
    })
  })

  describe('methods', () => {
    beforeEach(() => {
      TestManager.mockGlobalPlayer()
    })

    afterEach(() => {
      TestManager.cleanGlobalPlayer()
    })

    describe('getPlayerInstance', () => {
      it('should return `YT.Player` instance or null', async () => {
        const wrapper = TestManager.createWrapper({
          propsData: { enablejsapi: true },
        })
        expect(wrapper.vm.getPlayerInstance()).toBeNull()
        await TestManager.play(wrapper)
        expect(wrapper.vm.getPlayerInstance()).toBe(
          TestManager.getMockedPlayer().mock.instances[0]
        )
      })
    })

    describe('initPlayerInstance', () => {
      it('should throw if there is no `<iframe />` element', () => {
        const wrapper = TestManager.createWrapper({
          propsData: { enablejsapi: true },
        })
        expect(() => wrapper.vm.initPlayerInstance()).toThrow()
      })
    })
  })
})
