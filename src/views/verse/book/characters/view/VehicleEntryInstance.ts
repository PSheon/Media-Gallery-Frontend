import * as THREE from 'three'
import { VehicleSeat } from 'src/views/verse/book/vehicles/view/VehicleSeat'
import { Character } from 'src/views/verse/book/characters/view/Character'

export class VehicleEntryInstance {
  public character: Character

  // @ts-ignore
  public targetSeat: VehicleSeat

  // @ts-ignore
  public entryPoint: THREE.Object3D
  public wantsToDrive = false

  constructor(character: Character) {
    this.character = character
  }

  // eslint-disable-next-line
  public update(timeStep: number): void {
    const entryPointWorldPos = new THREE.Vector3()
    this.entryPoint.getWorldPosition(entryPointWorldPos)
    const viewVector = new THREE.Vector3().subVectors(entryPointWorldPos, this.character.position)
    this.character.setOrientation(viewVector)

    const heightDifference = viewVector.y
    viewVector.y = 0
    if (this.character.charState.canEnterVehicles && viewVector.length() < 0.2 && heightDifference < 2) {
      this.character.enterVehicle(this.targetSeat, this.entryPoint)
    }
  }
}
