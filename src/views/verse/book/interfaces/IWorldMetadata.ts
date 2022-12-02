import { INftMetadata } from 'src/views/verse/book/interfaces/INftMetadata'

export interface IWorldMetadata {
  owner: string
  displayName: string
  description: string
  worldScenePaths: string[]
  nftList: INftMetadata[]
}
