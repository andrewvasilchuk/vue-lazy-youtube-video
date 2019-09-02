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
  it('should create iframe when button is clicked', () => {
    const wrapper = factory()

    wrapper.find('button').trigger('click')
    expect(wrapper.find('iframe').exists()).toBeTruthy()
  })

  it('should correctly sets aspect ratio', () => {
    const [a, b] = [16, 9]

    const wrapper = factory({
      aspectRatio: `${a}:${b}`,
    })

    expect(wrapper.find('.y-video__inner').element.style.paddingBottom).toBe(
      `${(b / a) * 100}%`
    )
  })

  it('should sets alternative text of the preview image', () => {
    const alt = 'Simple dummy text'

    const wrapper = factory({
      alt,
    })

    expect(wrapper.find('img').element.getAttribute('alt')).toBe(alt)
  })
})
