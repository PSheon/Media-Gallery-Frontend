// ** Utils Imports
import { useQuery } from '@tanstack/react-query'

// ** Services Imports
import { getSceneModels } from 'src/services/api/sceneModel.service'

// ** Types Imports
import type { GetSceneModelResponse } from 'src/types/sceneModelTypes'

export const useSceneModelsQuery = () => useQuery<GetSceneModelResponse>(['scene-models'], () => getSceneModels())
