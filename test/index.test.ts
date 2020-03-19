import { shallowMount } from '@vue/test-utils'
import VueLazyYoutubeVideo from '../dist/vue-lazy-youtube-video'
import { classes } from './config'
import { defaultProps } from './fixtures'
import { clickAndGetIframe } from './helpers'

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

  it('should correctly set `src` attribute of the `<iframe />`', async () => {
    const wrapper = factory()
    const iframe = await clickAndGetIframe(wrapper)
    expect(iframe.element.getAttribute('src')).toBe(
      `https://www.youtube.com/embed/eJnQBXmZ7Ek?rel=0&showinfo=0&autoplay=1`
    )
  })

  it(`should correctly set \`padding bottom\` of the \`<element class="${classes.inner}"></element>\``, () => {
    const [a, b] = [16, 9]
    const wrapper = factory({
      aspectRatio: `${a}:${b}`,
    })
    expect(wrapper.find(classes.inner).element.style.paddingBottom).toBe(
      `${(b / a) * 100}%`
    )
  })

  it('should correctly set `alt` attribute of the preview `<img />`', () => {
    const alt = 'Simple dummy text'
    const wrapper = factory({
      alt,
    })
    expect(wrapper.find('img').element.getAttribute('alt')).toBe(alt)
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
})
