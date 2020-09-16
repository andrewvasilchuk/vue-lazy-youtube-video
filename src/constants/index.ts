export const DEFAULT_ALT_ATTRIBUTE = 'Video thumbnail'

export const DEFAULT_BUTTON_LABEL = 'Play video'

export const DEFAULT_ASPECT_RATIO = '16:9'

export const PREVIEW_IMAGE_SIZES = [
  'default',
  'mqdefault',
  'sddefault',
  'hqdefault',
  'maxresdefault',
] as const

export const DEFAULT_PREVIEW_IMAGE_SIZE = PREVIEW_IMAGE_SIZES[4]

export const DEFAULT_IFRAME_ATTRIBUTES = {
  allowfullscreen: true,
  frameborder: 0,
  allow:
    'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture',
}

export const YOUTUBE_REGEX = /^https:\/\/www\.youtube(?:-nocookie)?\.com\/embed\/(.+?)(?:\?.*)?$/

export const PLAYER_SCRIPT_SRC = 'https://www.youtube.com/player_api'

export const PLAYER_CHECK_MS = 32
