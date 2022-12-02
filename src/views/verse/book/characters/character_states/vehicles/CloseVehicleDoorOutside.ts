import { CharacterStateBase } from 'src/views/verse/book/characters/character_states/_stateLibrary'
import { Character } from 'src/views/verse/book/characters/Character'
import { VehicleSeat } from 'src/views/verse/book/vehicles/VehicleSeat'
import { Side } from 'src/views/verse/book/enums/Side'
import { Idle } from 'src/views/verse/book/characters/character_states/Idle'
import * as Utils from 'src/views/verse/book/core/FunctionLibrary'

export class CloseVehicleDoorOutside extends CharacterStateBase {
  private seat: VehicleSeat
  private hasClosedDoor = false

  constructor(character: Character, seat: VehicleSeat) {
    super(character)

    this.seat = seat
    this.canFindVehiclesToEnter = false

    const side = Utils.detectRelativeSide(seat.seatPointObject, seat.door.doorObject)
    if (side === Side.Left) {
      this.playAnimation('close_door_standing_right', 0.1)
    } else if (side === Side.Right) {
      this.playAnimation('close_door_standing_left', 0.1)
    }
  }

  public update(timeStep: number): void {
    super.update(timeStep)

    if (this.timer > 0.3 && !this.hasClosedDoor) {
      this.hasClosedDoor = true
      this.seat.door.close()
    }

    if (this.animationEnded(timeStep)) {
      this.character.setState(new Idle(this.character))
      this.character.leaveSeat()
    }
  }
}
