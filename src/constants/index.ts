import type { ThumnailSize } from '../types'

export const DEFAULT_ALT_ATTRIBUTE = 'Video thumbnail'

export const DEFAULT_BUTTON_LABEL = 'Play video'

export const DEFAULT_ASPECT_RATIO = '16:9'

export const THUMBNAIL_SIZE: Record<ThumnailSize, number> = {
  default: 120,
  mqdefault: 320,
  hqdefault: 480,
  sddefault: 640,
  maxresdefault: 1280,
}

export const DEFAULT_IFRAME_ATTRIBUTES = {
  allowfullscreen: true,
  frameborder: 0,
  allow:
    'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture',
}

export const YOUTUBE_REGEX = /^https:\/\/www\.youtube(?:-nocookie)?\.com\/embed\/(.+?)(?:\?.*)?$/
export const LOOM_REGEX = /^https:\/\/www\.loom\.com\/embed\/(.+?)(?:\?.*)?$/

export const PLAYER_SCRIPT_SRC = 'https://www.youtube.com/player_api'

export const PLAYER_CHECK_MS = 32
