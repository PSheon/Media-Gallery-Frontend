// ** Utils Imports
import axios from 'axios'

// ** Types Imports
import type { GetScenesProps, GetSceneResponse, GetScenesResponse, GetSceneProps } from 'src/types/sceneTypes'

export const getMeScenes = async (): Promise<GetScenesResponse> => {
  const { data } = await axios<GetScenesResponse>({
    method: 'GET',
    url: '/api/scenes/me'
  })

  return data
}

export const getScenes = async (params: GetScenesProps): Promise<GetScenesResponse> => {
  const enhancedParams = {
    filters: {
      published: true,
      ...(params.displayName && {
        displayName: {
          $contains: params.displayName
        }
      }),
      ...(params.type && {
        type: params.type
      })
    },
    pagination: {
      page: params.page,
      pageSize: params.pageSize
    }
  }

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
      ...enhancedParams
    }
  })

  return data
}

export const getScene = async (params: GetSceneProps): Promise<GetSceneResponse> => {
  const { data } = await axios<GetSceneResponse>({
    method: 'GET',
    url: `/api/scenes/${params.sid}`,
    params: {
      populate: {
        cover: true,
        owner: true,
        collaborators: {
          populate: {
            avatar: true
          }
        },
        assetList: {
          populate: {
            cover: true,
            owner: true
          }
        },
        sceneModel: true
      }
    }
  })

  return data
}
