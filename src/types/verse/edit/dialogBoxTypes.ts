export interface IInitialState {
  show: boolean
  hover: boolean
  hoverObjectType?: string
  hoverObjectMetadata?: {
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
