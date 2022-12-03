import { World } from 'src/views/verse/book/world/EditWorld'
import { EntityType } from 'src/views/verse/book/enums/EntityType'
import { IUpdatable } from 'src/views/verse/book/interfaces/IUpdatable'

export interface IWorldEntity extends IUpdatable {
  entityType: EntityType

  addToWorld(world: World): void
  removeFromWorld(world: World): void
}
