// ** Types Imports
import { IScene } from 'src/types/sceneTypes'

export interface GetMeSceneAssetsProps {
  chain: string
}

export interface GeSceneAssetsResponse {
  data: ISceneAsset[]
  meta: {}
}

export type ISceneAsset = {
  id: number
  attributes: {
    type: string
    cover?: {
      data?: {
        id: number
        attributes: {
          url: string
        }
      }
    }
    displayName: string
    description?: string
    framePosition?: string
    coverFileType?: 'png' | 'svg' | 'jpg' | 'gif' | 'mp4' | 'mp3'
    tokenChain: 'eth' | 'polygon' | 'bsc' | 'avalanche'
    tokenContract?: string
    tokenURI?: string
    tokenImageURI?: string
    tokenId?: string
    views: number
    fetchStatus: 'fetching' | 'fetched' | 'failed'
    fetchAttemptCount: number
    owner?: {
      data?: {
        id?: number
        attributes: {
          username: string
        }
      }
    }
    scene?: IScene
    published: boolean
    publishedAt: string
    createdAt: string
    updatedAt: string
  }
}
