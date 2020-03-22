import { shallowMount } from '@vue/test-utils'
import VueLazyYoutubeVideo from '../src/VueLazyYoutubeVideo.vue'
import { classes } from './config'
import { defaultProps } from './fixtures'
import { clickAndGetIframe } from './helpers'

beforeEach(() => {
  console.error = jest.fn()
  console.warn = jest.fn()
})

const factory = (props = {}) => {
  return shallowMount(VueLazyYoutubeVideo, {
    propsData: Object.assign({}, defaultProps, props),
  })
}

describe('VueLazyYoutubeVideo', () => {
  it('should insert `<iframe />` into the DOM when clicked', async () => {
    const wrapper = factory()
    const iframe = await clickAndGetIframe(wrapper)
    expect(iframe.exists()).toBeTruthy()
  })

  describe('props', () => {
    describe('url', () => {
      it('should correctly set `src` attribute of the `<iframe />`', async () => {
        const wrapper = factory()
        const iframe = await clickAndGetIframe(wrapper)
        expect(iframe.element.getAttribute('src')).toBe(
          `https://www.youtube.com/embed/eJnQBXmZ7Ek?rel=0&showinfo=0&autoplay=1`
        )
      })

      it('should call `console.error` when value with invalid type is passed', () => {
        const error = jest.spyOn(global.console, 'error')
        const invalidProps = [0, true, {}, [], () => {}]
        invalidProps.forEach(prop => {
          factory({ url: prop })
        })
        // * 2 – validator messages
        expect(error).toHaveBeenCalledTimes(invalidProps.length * 2)
      })

      it('should call `console.error` when invalid value is passed', () => {
        const error = jest.spyOn(global.console, 'error')
        factory({ url: 'INVALID_URL' })
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
          aspectRatio: `${a}:${b}`,
        })
        expect(wrapper.find(classes.inner).element.style.paddingBottom).toBe(
          `${(b / a) * 100}%`
        )
      })

      it(`should correctly set \`padding bottom\` of the \`<element class="${classes.inner}"></element>\` when invalid value is passed`, () => {
        const wrapper = factory({ aspectRatio: 'foo' })
        expect(wrapper.find(classes.inner).element.style.paddingBottom).toBe(
          `${(9 / 16) * 100}%`
        )
      })

      it('should call `console.error` when value with invalid type is passed', () => {
        const error = jest.spyOn(global.console, 'error')
        const invalidProps = [0, true, {}, [], () => {}]
        invalidProps.forEach(prop => {
          factory({ aspectRatio: prop })
        })
        expect(error).toHaveBeenCalledTimes(invalidProps.length)
      })
    })

    describe('alt', () => {
      it('should correctly set `alt` attribute of the preview `<img />` when valid value is passed', () => {
        const alt = 'foo'
        const wrapper = factory({
          alt,
        })
        expect(wrapper.find('img').element.getAttribute('alt')).toBe(alt)
      })

      it('should call `console.error` when value with invalid type is passed', () => {
        const error = jest.spyOn(global.console, 'error')
        const invalidProps = [0, true, {}, [], () => {}]
        invalidProps.forEach(prop => {
          factory({ alt: prop })
        })
        expect(error).toHaveBeenCalledTimes(invalidProps.length)
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
          buttonLabel,
        })
        expect(
          wrapper.find(classes.button).element.getAttribute('aria-label')
        ).toBe(buttonLabel)
      })

      it('should call `console.error` when value with invalid type is passed', () => {
        const error = jest.spyOn(global.console, 'error')
        const invalidProps = [0, true, {}, [], () => {}]
        invalidProps.forEach(prop => {
          factory({ buttonLabel: prop })
        })
        expect(error).toHaveBeenCalledTimes(invalidProps.length)
      })
    })

    describe('previewImageSize', () => {
      it('should correctly set `srcset` and `src` attributes of `<source />` and `<img />` when valid value is passed', () => {
        const previewImageSize = 'hqdefault'
        const wrapper = factory({
          previewImageSize,
        })
        const srcAttribute = wrapper.find('img').element.getAttribute('src')
        const srcsetAttribute = wrapper
          .find('source')
          .element.getAttribute('srcset')

        if (srcAttribute !== null) {
          expect(srcAttribute).toBe(
            `https://i.ytimg.com/vi/4JS70KB9GS0/${previewImageSize}.jpg`
          )
        }
        if (srcsetAttribute !== null) {
          expect(srcsetAttribute).toBe(
            `https://i.ytimg.com/vi_webp/4JS70KB9GS0/${previewImageSize}.webp`
          )
        }
      })

      it('should call `console.error` when value with invalid type is passed', () => {
        const error = jest.spyOn(global.console, 'error')
        const invalidProps = [0, true, {}, [], () => {}]
        invalidProps.forEach(prop => {
          factory({ previewImageSize: prop })
        })
        expect(error).toHaveBeenCalledTimes(invalidProps.length)
      })
    })

    describe('thumbnail', () => {
      it('should correctly set `srcset` and `src` attributes of thumbnails when valid value is passed', () => {
        const thumbnail = { webp: 'w', jpg: 'j' }
        const wrapper = factory({ thumbnail })
        const picture = wrapper.find('picture')
        expect(picture.find('source').element.getAttribute('srcset')).toEqual(
          thumbnail.webp
        )
        expect(picture.find('img').element.getAttribute('src')).toEqual(
          thumbnail.jpg
        )
      })

      it('should call `console.error` when value with invalid type is passed', () => {
        const error = jest.spyOn(global.console, 'error')
        const invalidProps = [0, '0', true, [], () => {}]
        invalidProps.forEach(prop => {
          factory({ thumbnail: prop })
        })
        expect(error).toHaveBeenCalledTimes(invalidProps.length)
      })

      it('should call `console.error` when value with invalid value is passed', () => {
        const error = jest.spyOn(global.console, 'error')
        factory({ thumbnail: { jpg: 'j' } })
        factory({ thumbnail: { webp: 'w' } })
        expect(error).toHaveBeenCalledTimes(2)
      })
    })

    describe('iframeAttributes', () => {
      it('should correctly set attributes of the `<iframe />` when valid value is passed', async done => {
        const iframeAttributes = { foo: 'bar', baz: 'vue' }
        const wrapper = factory({ iframeAttributes })
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
          factory({ iframeAttributes: prop })
        })
        expect(error).toHaveBeenCalledTimes(invalidProps.length)
      })
    })
  })
})
