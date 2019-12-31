import { Wrapper } from '@vue/test-utils'
import Component from '../../src/VueLazyYoutubeVideo.vue'

export async function clickAndGetIframe(wrapper: Wrapper<Component>) {
  wrapper.trigger('click')
  await wrapper.vm.$nextTick()
  return wrapper.find('iframe')
}

export function getImgAndSourceElements(wrapper: Wrapper<Component>) {
  const img = wrapper.find('img').element
  const source = wrapper.find('source').element

  return {
    img,
    source,
  }
}
