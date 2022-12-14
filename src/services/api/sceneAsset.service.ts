// ** Utils Imports
import axios from 'axios'

// ** Types Imports
import type { GetMeSceneAssetsProps, GetMeSceneAssetsResponse, ISceneAsset } from 'src/types/sceneAssetTypes'

export const getMeSceneAssets = async (params: GetMeSceneAssetsProps): Promise<ISceneAsset[]> => {
  const { data } = await axios<GetMeSceneAssetsResponse>({
    method: 'GET',
    url: '/api/scene-assets/me',
    params
  })

  return data.data
}
