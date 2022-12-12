export interface IInitialState {
  show: boolean
  hover: boolean
  hoverObjectType?: string
  hoverObjectMetadata: {
    displayName?: string
    position?: string
  }
}

export interface ISession {
  type: 'dialog' | 'display' | 'playerInfo'
  speaker: string
  content: string
  confirmButtonText?: string
  confirmCallback?: () => void

  artworkTitle?: string
  artworkDescription?: string
  artworkMediaUrl?: string

  playerDisplayName?: string
}
