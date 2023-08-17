import type { ThumnailSize } from '../types'
import { THUMBNAIL_SIZE } from '../constants'

/**
 * @see https://stackoverflow.com/a/30867255/11761617
 */
export function startsWith(
  string: string,
  value: string,
  position: number = 0
) {
  return string.indexOf(value, position) === position
}

export function isAspectRatio(value: string) {
  return /^\d+:\d+$/.test(value)
}

export function getThumbnailSize(width: number): ThumnailSize {
  if (width <= THUMBNAIL_SIZE.default) {
    return 'default'
  }

  if (width <= THUMBNAIL_SIZE.mqdefault) {
    return 'mqdefault'
  }

  if (width <= THUMBNAIL_SIZE.hqdefault) {
    return 'hqdefault'
  }

  if (width <= THUMBNAIL_SIZE.sddefault) {
    return 'sddefault'
  }

  return 'maxresdefault'
}
