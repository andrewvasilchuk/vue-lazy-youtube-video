export const DEFAULT_IFRAME_ATTRIBUTES = {
  allowfullscreen: true,
  frameborder: 0,
  allow:
    'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture',
}

export const PREVIEW_IMAGE_SIZES = [
  'default',
  'mqdefault',
  'sddefault',
  'hqdefault',
  'maxresdefault',
] as const

export const PLAYER_SCRIPT_SRC = 'https://www.youtube.com/player_api'
