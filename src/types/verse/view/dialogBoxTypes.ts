export interface IInitialState {
  show: boolean
  hover: boolean
  hoverObjectType?: string
  hoverObjectMetadata: {
    framePosition: string
    displayName: string
    position: {
      x: number
      y: number
      z: number
    }
    rotation: {
      x: number
      y: number
      z: number
    }
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
