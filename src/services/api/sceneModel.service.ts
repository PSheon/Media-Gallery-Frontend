// ** Utils Imports
import axios from 'axios'

// ** Types Imports
import type { GetMeSceneModelResponse, ISceneModel } from 'src/types/sceneModelTypes'

export const getSceneModels = async (): Promise<ISceneModel[]> => {
  const { data } = await axios<GetMeSceneModelResponse>({
    method: 'GET',
    url: '/api/scene-models',
    params: {
      populate: '*'
    }
  })

  return data.data
}
