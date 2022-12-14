import { IAsset } from 'src/types/assetTypes'

export interface IWorldMetadata {
  owner: string
  displayName: string
  description: string
  worldScenePaths: string[]
  assetList: IAsset[]
}
