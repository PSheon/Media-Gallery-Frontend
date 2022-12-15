// ** Utils Imports
import axios from 'axios'

// ** Types Imports
import type { GetSceneModelResponse } from 'src/types/sceneModelTypes'

export const getSceneModels = async (): Promise<GetSceneModelResponse> => {
  const { data } = await axios<GetSceneModelResponse>({
    method: 'GET',
    url: '/api/scene-models',
    params: {
      populate: '*'
    }
  })

  return data
}
