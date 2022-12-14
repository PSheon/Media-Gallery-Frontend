// ** Utils Imports
import axios from 'axios'

// ** Types Imports
import type {
  GetMeScenesResponse,
  GetScenesProps,
  GetSceneResponse,
  GetScenesResponse,
  GetSceneProps,
  IScene
} from 'src/types/sceneTypes'

export const getMeScenes = async (): Promise<IScene[]> => {
  const { data } = await axios<GetMeScenesResponse>({
    method: 'GET',
    url: '/api/scenes/me'
  })

  return data.data
}

export const getScenes = async (params: GetScenesProps): Promise<IScene[]> => {
  const { data } = await axios<GetScenesResponse>({
    method: 'GET',
    url: '/api/scenes',
    params: {
      populate: {
        cover: true,
        owner: {
          populate: {
            avatar: true
          }
        },
        collaborators: true,
        assetList: {
          populate: {
            cover: true
          }
        },
        sceneModel: true
      },
      pagination: params
    }
  })

  return data.data
}

export const getScene = async (params: GetSceneProps): Promise<IScene> => {
  const { data } = await axios<GetSceneResponse>({
    method: 'GET',
    url: `/api/scenes/${params.sid}`,
    params: {
      populate: {
        cover: true,
        owner: true,
        collaborators: true,
        assetList: {
          populate: {
            cover: true
          }
        },
        sceneModel: true
      }
    }
  })

  return data.data
}
