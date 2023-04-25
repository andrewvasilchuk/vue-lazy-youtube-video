export interface LoadIframeEventPayload {
  iframe: HTMLIFrameElement | null
}

export interface InitPlayerEventPayload {
  instance: YT.Player
}

export interface Thumbnail {
  webp: string
  jpg: string
}
