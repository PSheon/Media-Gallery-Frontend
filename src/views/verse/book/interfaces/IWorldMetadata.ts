import { INftMetadata } from 'src/views/verse/book/interfaces/INftMetadata'
import { IAsset } from 'src/types/scene/assetTypes'

export interface IWorldMetadata {
  owner: string
  displayName: string
  description: string
  worldScenePaths: string[]
  nftList: INftMetadata[]
  assetList: IAsset[]
}
