import { shallowMount } from '@vue/test-utils'
import VueLazyYoutubeVideo from '../dist/vue-lazy-youtube-video'

const factory = (props = {}) => {
  return shallowMount(VueLazyYoutubeVideo, {
    propsData: {
      url: 'https://www.youtube.com/watch?v=eJnQBXmZ7Ek',
      ...props,
    },
  })
}

describe('VueLazyYoutubeVideo', () => {
  it('should insert iframe into the DOM when button is clicked', () => {
    const wrapper = factory()

    wrapper.find('button').trigger('click')
    expect(wrapper.find('iframe').exists()).toBeTruthy()
  })

  it('should correctly set src attribute of iframe', () => {
    const wrapper = factory()

    wrapper.find('button').trigger('click')
    expect(wrapper.find('iframe').element.getAttribute('src')).toBe(
      'https://www.youtube.com/embed/eJnQBXmZ7Ek?rel=0&showinfo=0&autoplay=1'
    )
  })

  it('should correctly set aspect ratio', () => {
    const [a, b] = [16, 9]

    const wrapper = factory({
      aspectRatio: `${a}:${b}`,
    })

    expect(wrapper.find('.y-video__inner').element.style.paddingBottom).toBe(
      `${(b / a) * 100}%`
    )
  })

  it('should correctly set alternative text of the preview image', () => {
    const alt = 'Simple dummy text'

    const wrapper = factory({
      alt,
    })

    expect(wrapper.find('img').element.getAttribute('alt')).toBe(alt)
  })

  it('should correctly set aria-label attribute of a button', () => {
    const buttonLabel = 'Simple dummy text'

    const wrapper = factory({
      buttonLabel,
    })

    expect(wrapper.find('button').element.getAttribute('aria-label')).toBe(buttonLabel)
  })

  it('should correctly set size of the preview image', () => {
    const previewImageSize = 'hqdefault'

    const wrapper = factory({
      previewImageSize,
    })

    expect(
      wrapper
        .find('img')
        .element.getAttribute('src')
        .includes(previewImageSize)
    ).toBeTruthy()
  })
})
