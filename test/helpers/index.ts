import Vue from 'vue'
import { Wrapper } from '@vue/test-utils'

export async function clickAndGetIframe(wrapper: Wrapper<Vue>) {
  wrapper.trigger('click')
  await wrapper.vm.$nextTick()
  return wrapper.find('iframe')
}

export function getImgAndSourceElements(wrapper: Wrapper<Vue>) {
  const img = wrapper.find('img').element
  const source = wrapper.find('source').element

  return {
    img,
    source,
  }
}
