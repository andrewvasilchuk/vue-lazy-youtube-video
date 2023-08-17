import type { EventName } from './event'

export type Undefined<T> = T | undefined

export interface Events {
  [EventName.LOAD_IFRAME]: LoadIframeEventPayload
  [EventName.INIT_PLAYER]: InitPlayerEventPayload
}

export interface LoadIframeEventPayload {
  iframe?: HTMLIFrameElement
}

export interface InitPlayerEventPayload {
  instance: YT.Player
}

export type Refs = {
  iframe?: HTMLIFrameElement
}

export interface Thumbnail {
  jpg: string
  webp?: string
}

export const THUMBNAIL_SIZES = [
  'default',
  'mqdefault',
  'hqdefault',
  'sddefault',
  'maxresdefault',
] as const

export type ThumnailSize = typeof THUMBNAIL_SIZES[number]
