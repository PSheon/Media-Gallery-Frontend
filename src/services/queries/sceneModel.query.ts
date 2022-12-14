// ** Utils Imports
import { useQuery } from '@tanstack/react-query'

// ** Services Imports
import { getSceneModels } from 'src/services/api/sceneModel.service'

// ** Types Imports
import type { ISceneModel } from 'src/types/sceneModelTypes'

export const useSceneModelsQuery = () => useQuery<ISceneModel[]>(['scene-models'], () => getSceneModels())
