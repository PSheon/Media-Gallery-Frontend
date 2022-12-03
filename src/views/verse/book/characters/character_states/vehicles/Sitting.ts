import { CharacterStateBase } from 'src/views/verse/book/characters/character_states/_stateLibrary'
import { Character } from 'src/views/verse/book/characters/view/Character'
import { VehicleSeat } from 'src/views/verse/book/vehicles/VehicleSeat'
import { CloseVehicleDoorInside } from 'src/views/verse/book/characters/character_states/vehicles/CloseVehicleDoorInside'
import { SeatType } from 'src/views/verse/book/enums/SeatType'
import { SwitchingSeats } from 'src/views/verse/book/characters/character_states/vehicles/SwitchingSeats'

export class Sitting extends CharacterStateBase {
  private seat: VehicleSeat

  constructor(character: Character, seat: VehicleSeat) {
    super(character)

    this.seat = seat
    this.canFindVehiclesToEnter = false

    this.character.world!.updateControls([
      {
        keys: ['X'],
        desc: 'Switch seats'
      },
      {
        keys: ['F'],
        desc: 'Leave seat'
      }
    ])

    this.playAnimation('sitting', 0.1)
  }

  public update(timeStep: number): void {
    super.update(timeStep)

    if (!this.seat.door?.achievingTargetRotation && this.seat.door?.rotation > 0 && this.noDirection()) {
      this.character.setState(new CloseVehicleDoorInside(this.character, this.seat))
    } else if (this.character.vehicleEntryInstance !== undefined) {
      if (this.character.vehicleEntryInstance.wantsToDrive) {
        for (const possibleDriverSeat of this.seat.connectedSeats) {
          if (possibleDriverSeat.type === SeatType.Driver) {
            if (this.seat.door?.rotation > 0) this.seat.door.physicsEnabled = true
            this.character.setState(new SwitchingSeats(this.character, this.seat, possibleDriverSeat))
            break
          }
        }
      } else {
        this.character.vehicleEntryInstance = undefined
      }
    }
  }

  public onInputChange(): void {
    if (this.character.actions.seat_switch.justPressed && this.seat.connectedSeats.length > 0) {
      this.character.setState(new SwitchingSeats(this.character, this.seat, this.seat.connectedSeats[0]))
    }

    if (this.character.actions.enter.justPressed) {
      this.character.exitVehicle()
      this.character.displayControls()
    }
  }
}
