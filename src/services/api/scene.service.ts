// ** Utils Imports
import axios from 'axios'

// ** Types Imports
import type { GetMeScenesResponse, GetSceneResponse, GetSceneProps, IScene } from 'src/types/sceneTypes'

export const getMeScenes = async (): Promise<IScene[]> => {
  const { data } = await axios<GetMeScenesResponse>({
    method: 'GET',
    url: '/api/scenes/me'
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
