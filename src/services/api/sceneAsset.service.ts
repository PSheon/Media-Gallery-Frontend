// ** Utils Imports
import axios from 'axios'

// ** Types Imports
import type { GetMeSceneAssetsProps, GeSceneAssetsResponse } from 'src/types/sceneAssetTypes'

export const getMeSceneAssets = async (params: GetMeSceneAssetsProps): Promise<GeSceneAssetsResponse> => {
  const { data } = await axios<GeSceneAssetsResponse>({
    method: 'GET',
    url: '/api/scene-assets/me',
    params
  })

  return data
}
