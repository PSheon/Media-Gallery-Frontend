import { IUser } from 'src/types/userTypes'
import { IAsset } from 'src/types/assetTypes'
import { ISceneModel } from 'src/types/sceneModelTypes'

export interface GetSceneProps {
  sid: string
}

export interface GetMeScenesResponse {
  data: IScene[]
  meta: {}
}

export interface GetSceneResponse {
  data: IScene
  meta: {}
}

export type IScene = {
  id: number
  attributes: {
    cover?: {
      data?: {
        id: number
        attributes: {
          url: string
        }
      }
    }
    sceneId: string
    displayName: string
    description?: string
    owner: {
      data?: IUser
    }
    collaborators: {
      data?: IUser[]
    }
    assetList: {
      data?: IAsset[]
    }
    sceneModel: {
      data?: ISceneModel
    }
    featured: boolean
    published: boolean
    publishedAt: string
    createdAt: string
    updatedAt: string
  }
}
