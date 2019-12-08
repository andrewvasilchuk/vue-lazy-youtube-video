import Vue from 'vue'
import { shallowMount } from '@vue/test-utils'
import VueLazyYoutubeVideo from '../src/VueLazyYoutubeVideo.vue'
import { classes } from './config'
import { defaultProps } from './fixtures'
import { clickAndGetIframe } from './helpers'

beforeEach(() => {
  console.error = jest.fn()
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

  it('should correctly set src attribute of iframe', async () => {
    const wrapper = factory()
    wrapper.trigger('click')
    await Vue.nextTick()
    expect(wrapper.find('iframe').element.getAttribute('src')).toBe(
      `https://www.youtube.com/embed/4JS70KB9GS0?rel=0&showinfo=0&autoplay=1`
    )
  })

  it(`should correctly set padding bottom of <element class="${classes.inner}"></element>`, () => {
    const [a, b] = [16, 9]
    const wrapper = factory({
      aspectRatio: `${a}:${b}`,
    })
    expect(wrapper.find(classes.inner).element.style.paddingBottom).toBe(
      `${(b / a) * 100}%`
    )
  })

  it('should correctly set `alt` attribute of the preview <img />', () => {
    const alt = 'Simple dummy text'
    const wrapper = factory({
      alt,
    })
    expect(wrapper.find('img').element.getAttribute('alt')).toBe(alt)
  })

  it('should correctly set `aria-label` attribute of a <button></button>', () => {
    const buttonLabel = 'Simple dummy text'
    const wrapper = factory({
      buttonLabel,
    })
    expect(
      wrapper.find(classes.button).element.getAttribute('aria-label')
    ).toBe(buttonLabel)
  })

  it('should correctly set size of the preview image', () => {
    const previewImageSize = 'hqdefault'

    const wrapper = factory({
      previewImageSize,
    })

    const srcAttribute = wrapper.find('img').element.getAttribute('src')

    if (srcAttribute !== null) {
      expect(srcAttribute.includes(previewImageSize)).toBeTruthy()
    }
  })

  describe('props', () => {
    describe('url', () => {
      it('should call `console.error` invalid value is passed', () => {
        const error = jest.spyOn(global.console, 'error')
        factory({ url: 'INVALID_URL' })
        // valid url
        factory({ url: defaultProps.url })
        expect(error).toHaveBeenCalled()
      })
    })

    describe('noCookies', () => {
      it('should correctly set `src` attribute of <iframe /> when truthy value is passed', async () => {
        const wrapper = factory({ noCookie: true })
        const iframe = await clickAndGetIframe(wrapper)
        const srcAttribute = iframe.element.getAttribute('src')

        if (srcAttribute !== null) {
          expect(srcAttribute.startsWith('https://www.youtube-nocookie.com/embed/')).toBeTruthy()
        }
      })
    })
  })
})
