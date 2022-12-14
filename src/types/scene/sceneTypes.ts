import { IUser } from 'src/types/scene/userTypes'
import { IAsset } from 'src/types/scene/assetTypes'
import { ISceneModel } from 'src/types/scene/sceneModelTypes'

export interface GetMeAccessesResponse {
  data: IScene[]
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
