import { CharacterStateBase } from 'src/views/verse/book/characters/character_states/_stateLibrary'
import { Character } from 'src/views/verse/book/characters/view/Character'
import { VehicleSeat } from 'src/views/verse/book/vehicles/VehicleSeat'
import { Side } from 'src/views/verse/book/enums/Side'
import { Driving } from 'src/views/verse/book/characters/character_states/vehicles/Driving'
import { SeatType } from 'src/views/verse/book/enums/SeatType'
import { Sitting } from 'src/views/verse/book/characters/character_states/vehicles/Sitting'
import * as Utils from 'src/views/verse/book/core/FunctionLibrary'

export class CloseVehicleDoorInside extends CharacterStateBase {
  private seat: VehicleSeat
  private hasClosedDoor = false

  constructor(character: Character, seat: VehicleSeat) {
    super(character)

    this.seat = seat
    this.canFindVehiclesToEnter = false
    this.canLeaveVehicles = false

    const side = Utils.detectRelativeSide(seat.seatPointObject, seat.door.doorObject)
    if (side === Side.Left) {
      this.playAnimation('close_door_sitting_left', 0.1)
    } else if (side === Side.Right) {
      this.playAnimation('close_door_sitting_right', 0.1)
    }

    this.seat.door?.open()
  }

  public update(timeStep: number): void {
    super.update(timeStep)

    if (this.timer > 0.4 && !this.hasClosedDoor) {
      this.hasClosedDoor = true
      this.seat.door?.close()
    }

    if (this.animationEnded(timeStep)) {
      if (this.seat.type === SeatType.Driver) {
        this.character.setState(new Driving(this.character, this.seat))
      } else if (this.seat.type === SeatType.Passenger) {
        this.character.setState(new Sitting(this.character, this.seat))
      }
    }
  }
}
