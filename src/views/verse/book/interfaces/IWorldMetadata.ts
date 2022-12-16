import { ISceneAsset } from 'src/types/sceneAssetTypes'

export interface IWorldMetadata {
  sceneId?: number
  owner: string
  displayName: string
  description: string
  worldScenePaths: string[]
  assetList: ISceneAsset[]
  playerDisplayName?: string
  playerAvatarURL?: string
}
