import { Wrapper } from '@vue/test-utils'
import Component from '../../src/VueLazyYoutubeVideo'

export async function clickAndGetIframe(
  wrapper: Wrapper<InstanceType<typeof Component>>
) {
  wrapper.trigger('click')
  await wrapper.vm.$nextTick()
  return wrapper.find('iframe')
}

export function getImgAndSourceElements(
  wrapper: Wrapper<InstanceType<typeof Component>>
) {
  const img = wrapper.find('img').element
  const source = wrapper.find('source').element

  return {
    img,
    source,
  }
}
