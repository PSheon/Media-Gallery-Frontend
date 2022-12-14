import { ISceneAsset } from 'src/types/sceneAssetTypes'

export interface IWorldMetadata {
  owner: string
  displayName: string
  description: string
  worldScenePaths: string[]
  assetList: ISceneAsset[]
}
