// ** Utils Imports
import { useQuery } from '@tanstack/react-query'

// ** Services Imports
import { getMeScenes, getScene } from 'src/services/api/scene.service'

// ** Types Imports
import type { GetSceneProps, IScene } from 'src/types/sceneTypes'

export const useMeScenesQuery = () => useQuery<IScene[]>(['scenes', 'me'], () => getMeScenes())

export const useSceneQuery = (params: GetSceneProps) =>
  useQuery<IScene>(['scenes', params.sid], () => getScene(params), { enabled: !!params.sid })
