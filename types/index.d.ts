import { PluginObject } from 'vue'

import VueLazyYoutubeVideo from '../src/VueLazyYoutubeVideo'
import { Thumbnail } from '../src/types'

export default VueLazyYoutubeVideo

export declare const Plugin: PluginObject<never>

export * from '../src/types'

export interface Props {
  src: string
  alt?: string
  buttonLabel?: string
  aspectRatio?: string
  previewImageSize?: string
  thumbnail?: Thumbnail
  iframeAttributes?: Record<string, string | boolean | number>
  webp?: boolean
  autoplay?: boolean
  thumbnailListeners?: Record<string, Function | Function[]>
  enablejsapi?: boolean
  playerOptions?: Partial<YT.PlayerOptions>
  injectPlayerScript?: boolean
  parameters?: YT.PlayerVars
}
