import type Vue from 'vue'
import type { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import type { Wrapper, ThisTypedShallowMountOptions } from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'

import type { Props } from '../../types'
import VueLazyYoutubeVideo from '../../src/VueLazyYoutubeVideo'
import { PLAYER_SCRIPT_SRC } from '../../src/constants'

import { defaultProps } from '../fixtures'

type ComponentInstance = InstanceType<typeof VueLazyYoutubeVideo>
type LocalWrapper = Wrapper<ComponentInstance>

declare global {
  namespace NodeJS {
    interface Global {
      YT?: {
        Player?: jest.Mock
      }
    }
  }
}

export class TestManager {
  static createWrapper(
    options?: ThisTypedShallowMountOptions<ComponentInstance> & {
      propsData?: Partial<Props>
    }
  ) {
    return shallowMount<ComponentInstance>(VueLazyYoutubeVideo, {
      ...options,
      propsData: {
        ...defaultProps,
        ...(options !== undefined
          ? options.propsData !== undefined
            ? options.propsData
            : {}
          : {}),
      },
    })
  }

  static async clickAndGetIframe(wrapper: LocalWrapper) {
    wrapper.trigger('click')
    await wrapper.vm.$nextTick()
    return wrapper.find('iframe')
  }

  static async play(wrapper: LocalWrapper) {
    wrapper.trigger('click')
    await wrapper.vm.$nextTick()
    const iframe = wrapper.find('iframe')
    iframe.trigger('load')
  }

  static mockGlobalPlayer() {
    global.YT = {
      Player: jest.fn(),
    }
  }

  static getMockedPlayer() {
    const { YT } = global
    if (YT !== undefined && YT.Player !== undefined) {
      return YT.Player
    }
    throw new Error('Unable to get mocked player')
  }

  static cleanGlobalPlayer() {
    global.YT = undefined
  }

  static getPropDefinition<K extends keyof Props>(key: K) {
    const { props } = (VueLazyYoutubeVideo as typeof VueLazyYoutubeVideo & {
      options: ThisTypedComponentOptionsWithRecordProps<Vue, {}, {}, {}, Props>
    }).options
    if (props === undefined) throw new Error()
    return props[key]
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
    return document.querySelector(
      `script[src="${PLAYER_SCRIPT_SRC}"]`
    ) as HTMLScriptElement | null
  }

  static cleanScriptElement() {
    const script = document.querySelector(`script[src="${PLAYER_SCRIPT_SRC}"]`)

    if (script) {
      script.remove()
    }
  }
}
