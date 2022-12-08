export interface IInitialState {
  show: boolean
  hover: boolean
  hoverObjectType?: string
  hoverObjectMetadata: {
    displayName?: string
    position?: string
  }
}
