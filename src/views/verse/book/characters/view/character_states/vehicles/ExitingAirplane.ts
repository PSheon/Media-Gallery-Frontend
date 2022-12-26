import * as THREE from 'three'
import * as Utils from 'src/views/verse/book/core/FunctionLibrary'

import { Character } from 'src/views/verse/book/characters/view/Character'
import { VehicleSeat } from 'src/views/verse/book/vehicles/view/VehicleSeat'
import { Falling } from 'src/views/verse/book/characters/view/character_states/Falling'
import { ExitingStateBase } from 'src/views/verse/book/characters/view/character_states/vehicles/ExitingStateBase'
import { Vehicle } from 'src/views/verse/book/vehicles/view/Vehicle'

export class ExitingAirplane extends ExitingStateBase {
  constructor(character: Character, seat: VehicleSeat) {
    super(character, seat)

    this.endPosition.copy(this.startPosition)
    this.endPosition.y += 1

    const quat = Utils.threeQuat((seat.vehicle as unknown as Vehicle).collision.quaternion)
    const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(quat)
    this.exitPoint = new THREE.Object3D()
    this.exitPoint.lookAt(forward)
    this.exitPoint.position.copy(this.endPosition)

    this.playAnimation('jump_idle', 0.1)
  }

  public update(timeStep: number): void {
    super.update(timeStep)

    if (this.animationEnded(timeStep)) {
      this.detachCharacterFromVehicle()
      this.character.setState(new Falling(this.character))
      this.character.leaveSeat()
    } else {
      const beginningCutoff = 0.3
      const factor = THREE.MathUtils.clamp(
        (this.timer / this.animationLength - beginningCutoff) * (1 / (1 - beginningCutoff)),
        0,
        1
      )
      const smoothFactor = Utils.easeOutQuad(factor)
      const lerpPosition = new THREE.Vector3().lerpVectors(this.startPosition, this.endPosition, smoothFactor)
      this.character.setPosition(lerpPosition.x, lerpPosition.y, lerpPosition.z)

      // Rotation
      this.updateEndRotation()
      THREE.Quaternion.slerp(this.startRotation, this.endRotation, this.character.quaternion, smoothFactor)
    }
  }
}
