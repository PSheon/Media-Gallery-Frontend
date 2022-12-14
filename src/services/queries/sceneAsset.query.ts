// ** Utils Imports
import { useQuery } from '@tanstack/react-query'

// ** Services Imports
import { getMeSceneAssets } from 'src/services/api/sceneAsset.service'

// ** Types Imports
import type { GetMeSceneAssetsProps, ISceneAsset } from 'src/types/sceneAssetTypes'

export const useMeSceneAssetsQuery = (params: GetMeSceneAssetsProps) =>
  useQuery<ISceneAsset[]>(['scene-assets', 'me', { params }], () => getMeSceneAssets(params))
