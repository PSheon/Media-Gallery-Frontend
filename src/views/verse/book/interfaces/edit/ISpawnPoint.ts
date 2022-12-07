import { World } from 'src/views/verse/book/world/EditWorld'
import { LoadingManager } from 'src/views/verse/book/core/view/LoadingManager'

export interface ISpawnPoint {
  spawn(loadingManager: LoadingManager, world: World): void
}
