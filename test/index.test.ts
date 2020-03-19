import { shallowMount, ThisTypedShallowMountOptions } from '@vue/test-utils'
import VueLazyYoutubeVideo from '../src/VueLazyYoutubeVideo.vue'
import { classes } from './config'
import { defaultProps, getDefaultProps, VIDEO_ID } from './fixtures'
import { clickAndGetIframe, getImgAndSourceElements } from './helpers'

beforeEach(() => {
  console.error = jest.fn()
  console.warn = jest.fn()
})

const factory = (options?: ThisTypedShallowMountOptions<Vue>) => {
  return shallowMount(VueLazyYoutubeVideo, {
    ...options,
    propsData: {
      ...defaultProps,
      ...(options !== undefined
        ? options.propsData !== undefined
          ? options.propsData
          : {}
        : {}),
    },
  })
}

describe('VueLazyYoutubeVideo', () => {
  it('should insert `<iframe />` into the DOM when clicked', async () => {
    const wrapper = factory()
    const iframe = await clickAndGetIframe(wrapper)
    expect(iframe.exists()).toBeTruthy()
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
        invalidProps.forEach(prop => {
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
        invalidProps.forEach(prop => {
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
        invalidProps.forEach(prop => {
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
        invalidProps.forEach(prop => {
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

      it('should call `console.error` when value with invalid type is passed', () => {
        const error = jest.spyOn(global.console, 'error')
        const invalidProps = [0, true, {}, [], () => {}]
        invalidProps.forEach(prop => {
          factory({ propsData: { previewImageSize: prop } })
        })
        expect(error).toHaveBeenCalledTimes(invalidProps.length)
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
        invalidProps.forEach(prop => {
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
      it('should correctly set attributes of the `<iframe />` when valid value is passed', async done => {
        const iframeAttributes = { foo: 'bar', baz: 'vue' }
        const wrapper = factory({ propsData: { iframeAttributes } })
        const iframe = await clickAndGetIframe(wrapper)

        Object.entries(iframeAttributes).forEach(([key, value]) => {
          const attribute = iframe.element.getAttribute(key)

          if (attribute !== null) {
            expect(attribute).toEqual(value)
          } else {
            done.fail()
          }
        })

        done()
      })

      it('should call `console.error` when value with invalid type is passed', () => {
        const error = jest.spyOn(global.console, 'error')
        const invalidProps = [0, '0', true, [], () => {}]
        invalidProps.forEach(prop => {
          factory({ propsData: { iframeAttributes: prop } })
        })
        expect(error).toHaveBeenCalledTimes(invalidProps.length)
      })
    })
  })
})
