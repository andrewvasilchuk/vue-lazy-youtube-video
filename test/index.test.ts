import Vue from 'vue'
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
  it('should insert <iframe /> into the DOM when clicked', async () => {
    const wrapper = factory()
    wrapper.trigger('click')
    await Vue.nextTick()
    expect(wrapper.find('iframe').exists()).toBeTruthy()
  })

  describe('props', () => {
    describe('url', () => {
      it('should correctly set `src` attribute of <iframe /> when valid value is passed', async () => {
        const wrapper = factory()
        wrapper.trigger('click')
        await Vue.nextTick()
        expect(wrapper.find('iframe').element.getAttribute('src')).toBe(
          'https://www.youtube.com/embed/4JS70KB9GS0?autoplay=1'
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

      it('should call `console.error` invalid value is passed', () => {
        const error = jest.spyOn(global.console, 'error')
        factory({ url: 'INVALID_URL' })
        // valid url
        factory({ url: defaultProps.url })
        expect(error).toHaveBeenCalled()
      })
    })

    describe('alt', () => {
      it('should correctly set `alt` attribute of the preview <img /> when valid value is passed', () => {
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
          factory({ buttonLabel: prop })
        })
        expect(error).toHaveBeenCalledTimes(invalidProps.length)
      })
    })

    describe('buttonLabel', () => {
      it('should correctly set `aria-label` attribute of a <button></button> when no value is passed', () => {
        const wrapper = factory()
        expect(
          wrapper.find(classes.button).element.getAttribute('aria-label')
        ).toBe('Play video')
      })

      it('should correctly set `aria-label` attribute of a <button></button> when valid value is passed', () => {
        const buttonLabel = 'foo'
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

    describe('aspectRatio', () => {
      it(`should correctly set padding bottom of <element class="${classes.inner}"></element> when no value is passed`, () => {
        const wrapper = factory()
        expect(wrapper.find(classes.inner).element.style.paddingBottom).toBe(
          `${(9 / 16) * 100}%`
        )
      })

      it(`should correctly set padding bottom of <element class="${classes.inner}"></element> when valid value is passed`, () => {
        const [a, b] = [4, 3]
        const wrapper = factory({
          aspectRatio: `${a}:${b}`,
        })
        expect(wrapper.find(classes.inner).element.style.paddingBottom).toBe(
          `${(b / a) * 100}%`
        )
      })

      it(`should correctly set padding bottom of <element class="${classes.inner}"></element> when invalid value is passed`, () => {
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

    describe('previewImageSize', () => {
      it('should correctly set `srcset` and `src` attributes of thumbnails when valid value is passed', () => {
        const previewImageSize = 'hqdefault'
        const wrapper = factory({
          previewImageSize,
        })
        const srcAttribute = wrapper.find('img').element.getAttribute('src')
        if (srcAttribute !== null) {
          expect(srcAttribute.includes(previewImageSize)).toBeTruthy()
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
        // valid thumbnail
        factory({ thumbnail: { webp: 'w', jpg: 'j' } })
        expect(error).toHaveBeenCalledTimes(2)
      })
    })

    describe('noCookie', () => {
      it('should correctly set `src` attribute of <iframe /> when truthy value is passed', async () => {
        const wrapper = factory({ noCookie: true })
        const iframe = await clickAndGetIframe(wrapper)
        const srcAttribute = iframe.element.getAttribute('src')

        if (srcAttribute !== null) {
          expect(
            srcAttribute.startsWith('https://www.youtube-nocookie.com/embed/')
          ).toBeTruthy()
        }
      })

      it('should call `console.error` when value with invalid type is passed', () => {
        const error = jest.spyOn(global.console, 'error')
        const invalidProps = [0, '0', {}, [], () => {}]
        invalidProps.forEach(prop => {
          factory({ noCookie: prop })
        })
        expect(error).toHaveBeenCalledTimes(invalidProps.length)
      })
    })

    describe('iframeAttributes', () => {
      it('should correctly set attributes of <iframe /> when valid value is passed', async done => {
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
