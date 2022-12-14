// ** Utils Imports
import axios from 'axios'

// ** Types Imports
import type { GetMeAccessesResponse, IScene } from 'src/types/sceneTypes'

export const getMeScenes = async (): Promise<IScene[]> => {
  const { data } = await axios<GetMeAccessesResponse>({
    method: 'GET',
    url: '/api/scenes/me'
  })

  return data.data
}
