export interface IInitialState {
  show: boolean
  hover: boolean
  speaker: string
  session: ISession[]
  step: number
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
