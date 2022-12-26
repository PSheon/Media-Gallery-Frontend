import { Character } from 'src/views/verse/book/characters/view/Character'
import { IInputReceiver } from 'src/views/verse/book/interfaces/IInputReceiver'
import { VehicleSeat } from 'src/views/verse/book/vehicles/view/VehicleSeat'
import { EntityType } from 'src/views/verse/book/enums/EntityType'

export interface IControllable extends IInputReceiver {
  entityType: EntityType
  seats: VehicleSeat[]
  position: THREE.Vector3
  controllingCharacter: Character | undefined

  triggerAction(actionName: string, value: boolean): void
  resetControls(): void
  allowSleep(value: boolean): void
  onInputChange(): void
  noDirectionPressed(): boolean
}
