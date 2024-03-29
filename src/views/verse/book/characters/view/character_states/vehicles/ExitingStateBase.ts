import * as THREE from 'three'
import * as Utils from 'src/views/verse/book/core/FunctionLibrary'

import { CharacterStateBase } from 'src/views/verse/book/characters/view/character_states/_stateLibrary'
import { Character } from 'src/views/verse/book/characters/view/Character'
import { VehicleSeat } from 'src/views/verse/book/vehicles/view/VehicleSeat'
import { IControllable } from 'src/views/verse/book/interfaces/IControllable'
import { Vehicle } from 'src/views/verse/book/vehicles/view/Vehicle'

export abstract class ExitingStateBase extends CharacterStateBase {
  protected vehicle: IControllable
  protected seat: VehicleSeat
  protected startPosition: THREE.Vector3 = new THREE.Vector3()
  protected endPosition: THREE.Vector3 = new THREE.Vector3()
  protected startRotation: THREE.Quaternion = new THREE.Quaternion()
  protected endRotation: THREE.Quaternion = new THREE.Quaternion()

  // @ts-ignore
  protected exitPoint: THREE.Object3D
  protected dummyObj: THREE.Object3D

  constructor(character: Character, seat: VehicleSeat) {
    super(character)

    this.canFindVehiclesToEnter = false
    this.seat = seat
    this.vehicle = seat.vehicle

    this.seat.door?.open()

    this.startPosition.copy(this.character.position)
    this.startRotation.copy(this.character.quaternion)

    this.dummyObj = new THREE.Object3D()
  }

  public detachCharacterFromVehicle(): void {
    this.character.controlledObject = undefined
    this.character.resetOrientation()
    this.character?.world?.graphicsWorld.attach(this.character)
    this.character.resetVelocity()
    this.character.setPhysicsEnabled(true)
    this.character.setPosition(this.character.position.x, this.character.position.y, this.character.position.z)
    this.character.inputReceiverUpdate(0)
    this.character.characterCapsule.body.velocity.copy(
      (this.vehicle as unknown as Vehicle).rayCastVehicle.chassisBody.velocity
    )
    this.character.feetRaycast()
  }

  public updateEndRotation(): void {
    const forward = Utils.getForward(this.exitPoint)
    forward.y = 0
    forward.normalize()

    this.character.world?.graphicsWorld.attach(this.dummyObj)
    this.exitPoint.getWorldPosition(this.dummyObj.position)
    const target = this.dummyObj.position.clone().add(forward)
    this.dummyObj.lookAt(target)
    this.seat.seatPointObject?.parent?.attach(this.dummyObj)
    this.endRotation.copy(this.dummyObj.quaternion)
  }
}
