// ** Utils Imports
import { useQuery } from '@tanstack/react-query'

// ** Services Imports
import { getMeScenes } from 'src/services/api/scene.service'

// ** Types Imports
import type { IScene } from 'src/types/sceneTypes'

export const useMeScenesQuery = () => useQuery<IScene[]>(['scenes', 'me'], () => getMeScenes())
