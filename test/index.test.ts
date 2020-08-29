import { shallowMount, ThisTypedShallowMountOptions } from '@vue/test-utils'
import VueLazyYoutubeVideo from '../src/VueLazyYoutubeVideo'
import { DEFAULT_IFRAME_ATTRIBUTES } from '../src/constants'
import { classes } from './config'
import { defaultProps, getDefaultProps, VIDEO_ID } from './fixtures'
import { clickAndGetIframe, getImgAndSourceElements } from './helpers'

beforeEach(() => {
  console.error = jest.fn()
  console.warn = jest.fn()
})

const factory = (options?: ThisTypedShallowMountOptions<Vue>) => {
  return shallowMount<InstanceType<typeof VueLazyYoutubeVideo>>(
    VueLazyYoutubeVideo,
    {
      ...options,
      propsData: {
        ...defaultProps,
        ...(options !== undefined
          ? options.propsData !== undefined
            ? options.propsData
            : {}
          : {}),
      },
    }
  )
}

describe('VueLazyYoutubeVideo', () => {
  it('should insert `<iframe />` into the DOM when clicked', async () => {
    const wrapper = factory()
    const iframe = await clickAndGetIframe(wrapper)
    expect(iframe.exists()).toBeTruthy()
  })

  it('should remove button and thumbnail when clicked', async () => {
    const wrapper = factory()
    await clickAndGetIframe(wrapper)
    expect(wrapper.find(classes.button).exists()).toBeFalsy()
    expect(wrapper.find('picture').exists()).toBeFalsy()
  })

  describe('props', () => {
    describe('src', () => {
      it('should correctly set `src` attribute of the `<iframe />`', async () => {
        let wrapper = factory()
        let iframe = await clickAndGetIframe(wrapper)
        expect(iframe.element.getAttribute('src')).toBe(
          `${defaultProps.src}?autoplay=1`
        )
        const query = '?loop=1'
        wrapper = factory({ propsData: getDefaultProps({ query }) })
        iframe = await clickAndGetIframe(wrapper)
        expect(iframe.element.getAttribute('src')).toBe(
          `${defaultProps.src}${query}&autoplay=1`
        )
      })

      it('should call `console.error` when value with invalid type is passed', () => {
        const error = jest.spyOn(global.console, 'error')
        const invalidProps = [0, true, {}, [], () => {}]
        invalidProps.forEach((prop) => {
          factory({ propsData: { src: prop } })
        })
        expect(error).toHaveBeenCalledTimes(invalidProps.length)
      })

      it('should call `console.error` when invalid value is passed', () => {
        const error = jest.spyOn(global.console, 'error')
        factory({ propsData: { src: 'INVALID_SRC' } })
        expect(error).toHaveBeenCalled()
      })

      it('should call `console.error` when no value is passed', () => {
        const error = jest.spyOn(global.console, 'error')
        factory({ propsData: { src: undefined } })
        expect(error).toHaveBeenCalled()
      })
    })

    describe('aspectRatio', () => {
      it(`should correctly set \`padding bottom\` of the \`<element class="${classes.inner}"></element>\` when no value is passed`, () => {
        const wrapper = factory()
        expect(wrapper.find(classes.inner).element.style.paddingBottom).toBe(
          `${(9 / 16) * 100}%`
        )
      })

      it(`should correctly set \`padding bottom\` of the \`<element class="${classes.inner}"></element>\` when valid value is passed`, () => {
        const [a, b] = [4, 3]
        const wrapper = factory({
          propsData: { aspectRatio: `${a}:${b}` },
        })
        expect(wrapper.find(classes.inner).element.style.paddingBottom).toBe(
          `${(b / a) * 100}%`
        )
      })

      it(`should correctly set \`padding bottom\` of the \`<element class="${classes.inner}"></element>\` when invalid value is passed`, () => {
        const wrapper = factory({ propsData: { aspectRatio: 'foo' } })
        expect(wrapper.find(classes.inner).element.style.paddingBottom).toBe(
          `${(9 / 16) * 100}%`
        )
      })

      it('should call `console.error` when value with invalid type is passed', () => {
        const error = jest.spyOn(global.console, 'error')
        const invalidProps = [0, true, {}, [], () => {}]
        invalidProps.forEach((prop) => {
          factory({ propsData: { aspectRatio: prop } })
        })
        expect(error).toHaveBeenCalledTimes(invalidProps.length)
      })
    })

    describe('alt', () => {
      it('should correctly set `alt` attribute of the preview `<img />` when valid value is passed', () => {
        const alt = 'foo'
        const wrapper = factory({
          propsData: { alt },
        })
        expect(wrapper.find('img').element.getAttribute('alt')).toBe(alt)
      })

      it('should call `console.error` when value with invalid type is passed', () => {
        const error = jest.spyOn(global.console, 'error')
        const invalidProps = [0, true, {}, [], () => {}]
        invalidProps.forEach((prop) => {
          factory({ propsData: { alt: prop } })
        })
        expect(error).toHaveBeenCalledTimes(invalidProps.length)
      })

      it('should correctly set `alt` attribute of the preview `<img />` when no value is passed', () => {
        const wrapper = factory()
        expect(wrapper.find('img').element.getAttribute('alt')).toBe(
          'Video thumbnail'
        )
      })
    })

    describe('buttonLabel', () => {
      it('should correctly set `aria-label` attribute of the `<button></button>` when no value is passed', () => {
        const wrapper = factory()
        expect(
          wrapper.find(classes.button).element.getAttribute('aria-label')
        ).toBe('Play video')
      })

      it('should correctly set `aria-label` attribute of the `<button></button>` when valid value is passed', () => {
        const buttonLabel = 'Simple dummy text'
        const wrapper = factory({
          propsData: { buttonLabel },
        })
        expect(
          wrapper.find(classes.button).element.getAttribute('aria-label')
        ).toBe(buttonLabel)
      })

      it('should call `console.error` when value with invalid type is passed', () => {
        const error = jest.spyOn(global.console, 'error')
        const invalidProps = [0, true, {}, [], () => {}]
        invalidProps.forEach((prop) => {
          factory({ propsData: { buttonLabel: prop } })
        })
        expect(error).toHaveBeenCalledTimes(invalidProps.length)
      })
    })

    describe('previewImageSize', () => {
      it('should correctly set `srcset` and `src` attributes of `<source />` and `<img />` when valid value is passed', () => {
        const previewImageSize = 'hqdefault'
        const wrapper = factory({
          propsData: {
            previewImageSize,
          },
        })
        const { img, source } = getImgAndSourceElements(wrapper)
        const srcAttribute = img.getAttribute('src')
        const srcsetAttribute = source.getAttribute('srcset')

        if (srcAttribute !== null) {
          expect(srcAttribute).toBe(
            `https://i.ytimg.com/vi/${VIDEO_ID}/${previewImageSize}.jpg`
          )
        }
        if (srcsetAttribute !== null) {
          expect(srcsetAttribute).toBe(
            `https://i.ytimg.com/vi_webp/${VIDEO_ID}/${previewImageSize}.webp`
          )
        }
      })

      it('should call `console.error` when invalid value is passed', () => {
        const error = jest.spyOn(global.console, 'error')
        factory({
          propsData: { previewImageSize: 'INVALID_PREVIEW_IMAGE_SIZE' },
        })
        expect(error).toHaveBeenCalled()
      })

      it('should call `console.error` when value with invalid type is passed', () => {
        const error = jest.spyOn(global.console, 'error')
        const invalidProps = [0, true, {}, [], () => {}]
        invalidProps.forEach((prop) => {
          factory({ propsData: { previewImageSize: prop } })
        })
        expect(error).toHaveBeenCalledTimes(invalidProps.length)
      })

      it('should correctly set `srcset` and `src` attributes of `<source />` and `<img />` when no value is passed', () => {
        const wrapper = factory()
        const { img, source } = getImgAndSourceElements(wrapper)
        const srcAttribute = img.getAttribute('src')
        const srcsetAttribute = source.getAttribute('srcset')

        if (srcAttribute) {
          expect(srcAttribute).toBe(
            `https://i.ytimg.com/vi/${VIDEO_ID}/maxresdefault.jpg`
          )
        }

        if (srcsetAttribute) {
          expect(srcsetAttribute).toBe(
            `https://i.ytimg.com/vi_webp/${VIDEO_ID}/maxresdefault.webp`
          )
        }
      })
    })

    describe('thumbnail', () => {
      it('should correctly set `srcset` and `src` attributes of thumbnails when valid value is passed', () => {
        const thumbnail = { webp: 'w', jpg: 'j' }
        const wrapper = factory({ propsData: { thumbnail } })
        const { img, source } = getImgAndSourceElements(wrapper)
        expect(source.getAttribute('srcset')).toEqual(thumbnail.webp)
        expect(img.getAttribute('src')).toEqual(thumbnail.jpg)
      })

      it('should call `console.error` when value with invalid type is passed', () => {
        const error = jest.spyOn(global.console, 'error')
        const invalidProps = [0, '0', true, [], () => {}]
        invalidProps.forEach((prop) => {
          factory({ propsData: { thumbnail: prop } })
        })
        expect(error).toHaveBeenCalledTimes(invalidProps.length)
      })

      it('should call `console.error` when value with invalid value is passed', () => {
        const error = jest.spyOn(global.console, 'error')
        factory({ propsData: { thumbnail: { jpg: 'j' } } })
        factory({ propsData: { thumbnail: { webp: 'w' } } })
        expect(error).toHaveBeenCalledTimes(2)
      })
    })

    describe('iframeAttributes', () => {
      it('should correctly set attributes of the `<iframe />` when valid value is passed', async (done) => {
        const iframeAttributes = { foo: 'bar', baz: 'vue' }
        const wrapper = factory({ propsData: { iframeAttributes } })
        const iframe = await clickAndGetIframe(wrapper)

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

      it('should call `console.error` when value with invalid type is passed', () => {
        const error = jest.spyOn(global.console, 'error')
        const invalidProps = [0, '0', true, [], () => {}]
        invalidProps.forEach((prop) => {
          factory({ propsData: { iframeAttributes: prop } })
        })
        expect(error).toHaveBeenCalledTimes(invalidProps.length)
      })

      it('should correctly set attributes of the `<iframe />` when no value is passed ', async () => {
        const wrapper = factory()
        const iframe = await clickAndGetIframe(wrapper)
        const { element } = iframe
        const allowfullscreen = element.getAttribute('allowfullscreen')
        expect(allowfullscreen).toEqual('allowfullscreen')
        const frameborder = element.getAttribute('frameborder')
        expect(frameborder).toEqual('0')
        const allow = element.getAttribute('allow')
        expect(allow).toEqual(
          'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
        )
      })
    })

    describe('webp', () => {
      it('should not render `<source />` element when `false` is passed', () => {
        const wrapper = factory({ propsData: { webp: false } })
        const source = wrapper.find('source')
        expect(source.exists()).toBeFalsy()
      })

      it('should render `<source />` element when `true` is passed', () => {
        const wrapper = factory({ propsData: { webp: true } })
        const source = wrapper.find('source')
        expect(source.exists()).toBeTruthy()
      })

      it('should call `console.error` when value with invalid type is passed', () => {
        const error = jest.spyOn(global.console, 'error')
        const invalidProps = [1, 'foo', [], () => {}]
        invalidProps.forEach((prop) => {
          factory({ propsData: { iframeAttributes: prop } })
        })
        expect(error).toHaveBeenCalledTimes(invalidProps.length)
      })
    })

    describe('autoplay', () => {
      it('should set initial value of `activated` data property', () => {
        const autoplay = true
        const wrapper = factory({ propsData: { autoplay } })
        expect(wrapper.vm.activated).toBe(autoplay)
      })

      it('should call `console.error` when value with invalid type is passed', () => {
        const error = jest.spyOn(global.console, 'error')
        const invalidProps = [1, 'foo', [], () => {}]
        invalidProps.forEach((prop) => {
          factory({ propsData: { autoplay: prop } })
        })
        expect(error).toHaveBeenCalledTimes(invalidProps.length)
      })
    })

    describe('thumbnailListeners', () => {
      it('should bind passed listeners', () => {
        const click = jest.fn(() => true)
        const wrapper = factory({
          propsData: { thumbnailListeners: { click } },
        })
        const img = wrapper.find('img')
        img.element.click()
        expect(click).toHaveBeenCalled()
      })

      it('should call `console.error` and throw an error when value with invalid type is passed', () => {
        const error = jest.spyOn(global.console, 'error')
        const invalidProps = [1, 'foo', true, [], () => {}]
        invalidProps.forEach((prop) => {
          try {
            factory({ propsData: { thumbnailListeners: prop } })
          } catch (e) {}
        })
        expect(error).toHaveBeenCalledTimes(invalidProps.length)
      })
    })
  })

  describe('events', () => {
    describe('load:iframe', () => {
      it("should emit event when `<iframe />`' `load` event happens", async () => {
        const wrapper = factory()
        const iframe = await clickAndGetIframe(wrapper)
        iframe.trigger('load')
        expect(wrapper.emitted()['load:iframe']).toBeTruthy()
      })

      it('should provide correct payload', async () => {
        const wrapper = factory()
        const iframe = await clickAndGetIframe(wrapper)
        iframe.trigger('load')
        expect(wrapper.emitted()['load:iframe']![0][0].iframe).toEqual(
          iframe.element
        )
      })
    })
  })

  describe('slots', () => {
    describe('icon', () => {
      it('should render when passed', async () => {
        const icon = '<svg><g></g></svg>'
        const wrapper = factory({ slots: { icon } })
        expect(wrapper.find(classes.button).element.innerHTML).toBe(icon)
      })
    })

    describe('button', () => {
      it('should render when passed', async () => {
        const button = '<button type="button">foo</button>'
        const wrapper = factory({ slots: { button } })
        expect(wrapper.find('button').element.outerHTML).toBe(button)
      })
    })
  })
})
