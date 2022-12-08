import { IScene } from 'src/types/scene/sceneTypes'

export type IAsset = {
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
    tokenContract?: string
    tokenURI?: string
    tokenImageURI?: string
    tokenId?: number
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
