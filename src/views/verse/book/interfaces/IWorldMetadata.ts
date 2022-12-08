import { IAsset } from 'src/types/scene/assetTypes'

export interface IWorldMetadata {
  owner: string
  displayName: string
  description: string
  worldScenePaths: string[]
  assetList: IAsset[]
}
