import { VueWrapper, mount } from '@vue/test-utils'

import type { Props } from '../../types'
import VueLazyYoutubeVideo from '../../src/VueLazyYoutubeVideo.vue'
import { PLAYER_SCRIPT_SRC } from '../../src/constants'

import { defaultProps } from '../fixtures'
import { vi, Mock } from 'vitest'

type LocalWrapper = VueWrapper<InstanceType<typeof VueLazyYoutubeVideo>>

export class TestManager {
  static createWrapper(
    options?: Record<string, any> & { props?: Partial<Props> }
  ) {
    return mount(VueLazyYoutubeVideo, {
      ...options,
      props: {
        ...defaultProps,
        ...options?.props,
      },
    })
  }

  static async clickAndGetIframe(wrapper: LocalWrapper) {
    await wrapper.trigger('click')
    return wrapper.find('iframe')
  }

  static async play(wrapper: LocalWrapper) {
    await wrapper.trigger('click')
    const iframe = wrapper.find('iframe')
    iframe.trigger('load')
  }

  static mockGlobalPlayer() {
    global.YT = {
      Player: vi.fn(),
    } as any
  }

  static getMockedPlayer() {
    const { YT } = global
    if (YT?.Player !== undefined) {
      return YT.Player as Mock
    }
    throw new Error('Unable to get mocked player')
  }

  static cleanGlobalPlayer() {
    global.YT = undefined as any
  }

  static getPropDefinition<K extends keyof Props>(key: K) {
    return VueLazyYoutubeVideo.props[key]
  }

  static getImgAndSourceElements(wrapper: LocalWrapper) {
    const img = wrapper.find('img').element
    const source = wrapper.find('source').element

    return {
      img,
      source,
    }
  }

  static getIframeElement(wrapper: LocalWrapper) {
    return wrapper.find('iframe').element
  }

  static getScriptElement() {
    return document.querySelector<HTMLScriptElement>(
      `script[src="${PLAYER_SCRIPT_SRC}"]`
    )
  }

  static cleanScriptElement() {
    const script = document.querySelector(`script[src="${PLAYER_SCRIPT_SRC}"]`)

    if (script) {
      script.remove()
    }
  }
}
