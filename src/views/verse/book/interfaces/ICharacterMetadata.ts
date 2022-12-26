export interface ICharacterMetadata {
  objectType: string
  objectMetadata: {
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
