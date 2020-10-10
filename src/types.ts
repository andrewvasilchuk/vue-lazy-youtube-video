import type { Event } from './event'

export interface Events {
  [Event.LOAD_IFRAME]: LoadIframeEventPayload
  [Event.INIT_PLAYER]: InitPlayerEventPayload
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
  webp: string
  jpg: string
}
