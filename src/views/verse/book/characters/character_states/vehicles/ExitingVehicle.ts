import * as THREE from 'three'
import * as Utils from 'src/views/verse/book/core/FunctionLibrary'

import { Character } from 'src/views/verse/book/characters/view/Character'
import { Side } from 'src/views/verse/book/enums/Side'
import { VehicleSeat } from 'src/views/verse/book/vehicles/VehicleSeat'
import { Idle } from 'src/views/verse/book/characters/character_states/Idle'
import { CloseVehicleDoorOutside } from 'src/views/verse/book/characters/character_states/vehicles/CloseVehicleDoorOutside'
import { Vehicle } from 'src/views/verse/book/vehicles/Vehicle'
import { Falling } from 'src/views/verse/book/characters/character_states/Falling'
import { DropRolling } from 'src/views/verse/book/characters/character_states/DropRolling'
import { ExitingStateBase } from 'src/views/verse/book/characters/character_states/vehicles/ExitingStateBase'

export class ExitingVehicle extends ExitingStateBase {
  constructor(character: Character, seat: VehicleSeat) {
    super(character, seat)

    this.exitPoint = seat.entryPoints[0]

    this.endPosition.copy(this.exitPoint.position)
    this.endPosition.y += 0.52

    const side = Utils.detectRelativeSide(seat.seatPointObject, this.exitPoint)
    if (side === Side.Left) {
      this.playAnimation('stand_up_left', 0.1)
    } else if (side === Side.Right) {
      this.playAnimation('stand_up_right', 0.1)
    }
  }

  public update(timeStep: number): void {
    super.update(timeStep)

    if (this.animationEnded(timeStep)) {
      this.detachCharacterFromVehicle()

      this.seat.door.physicsEnabled = true

      if (!this.character.rayHasHit) {
        this.character.setState(new Falling(this.character))
        this.character.leaveSeat()
      } else if ((this.vehicle as unknown as Vehicle).collision.velocity.length() > 1) {
        this.character.setState(new DropRolling(this.character))
        this.character.leaveSeat()
      } else if (this.anyDirection() || this.seat.door === undefined) {
        this.character.setState(new Idle(this.character))
        this.character.leaveSeat()
      } else {
        this.character.setState(new CloseVehicleDoorOutside(this.character, this.seat))
      }
    } else {
      // Door
      if (this.seat.door) {
        this.seat.door.physicsEnabled = false
      }

      // Position
      const factor = this.timer / this.animationLength
      const smoothFactor = Utils.easeInOutSine(factor)
      const lerpPosition = new THREE.Vector3().lerpVectors(this.startPosition, this.endPosition, smoothFactor)
      this.character.setPosition(lerpPosition.x, lerpPosition.y, lerpPosition.z)

      // Rotation
      this.updateEndRotation()
      THREE.Quaternion.slerp(this.startRotation, this.endRotation, this.character.quaternion, smoothFactor)
    }
  }
}
