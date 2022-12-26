// ** Utils Imports
import { useQuery } from '@tanstack/react-query'

// ** Services Imports
import { getMeScenes, getScenes, getScene } from 'src/services/api/scene.service'

// ** Types Imports
import type { GetSceneProps, GetScenesProps, GetScenesResponse, GetSceneResponse } from 'src/types/sceneTypes'

export const useMeScenesQuery = () => useQuery<GetScenesResponse>(['scenes', 'me'], () => getMeScenes())

export const useScenesQuery = (params: GetScenesProps) =>
  useQuery<GetScenesResponse>(['scenes', { params }], () => getScenes(params), { keepPreviousData: true })

export const useSceneQuery = (params: GetSceneProps) =>
  useQuery<GetSceneResponse>(['scenes', params.sid], () => getScene(params), { enabled: !!params.sid })
