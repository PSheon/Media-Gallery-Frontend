import * as THREE from 'three'
import { ISpawnPoint } from 'src/views/verse/book/interfaces/view/ISpawnPoint'
import { World } from 'src/views/verse/book/world/World'
import { Helicopter } from 'src/views/verse/book/vehicles/view/Helicopter'
import { Airplane } from 'src/views/verse/book/vehicles/view/Airplane'
import { Car } from 'src/views/verse/book/vehicles/view/Car'
import * as Utils from 'src/views/verse/book/core/FunctionLibrary'
import { Vehicle } from 'src/views/verse/book/vehicles/view/Vehicle'
import { Character } from 'src/views/verse/book/characters/view/Character'
import { FollowPath } from 'src/views/verse/book/characters/view/character_ai/FollowPath'
import { LoadingManager } from 'src/views/verse/book/core/view/LoadingManager'

export class VehicleSpawnPoint implements ISpawnPoint {
  // @ts-ignore
  public type: string

  // @ts-ignore
  public driver: string

  // @ts-ignore
  public firstAINode: string

  private object: THREE.Object3D

  constructor(object: THREE.Object3D) {
    this.object = object
  }

  public spawn(loadingManager: LoadingManager, world: World): void {
    loadingManager.loadGLTF('/assets/book/vehicle/' + this.type + '.glb', (model: any) => {
      const vehicle: Vehicle = this.getNewVehicleByType(model, this.type)
      vehicle.spawnPoint = this.object

      const worldPos = new THREE.Vector3()
      const worldQuat = new THREE.Quaternion()
      this.object.getWorldPosition(worldPos)
      this.object.getWorldQuaternion(worldQuat)

      vehicle.setPosition(worldPos.x, worldPos.y + 1, worldPos.z)
      vehicle.collision.quaternion.copy(Utils.cannonQuat(worldQuat))
      world.add(vehicle)

      if (this.driver !== undefined) {
        loadingManager.loadGLTF('/assets/book/character/ship_bear.glb', charModel => {
          const character = new Character(charModel)
          world.add(character)
          character.teleportToVehicle(vehicle, vehicle.seats[0])

          if (this.driver === 'player') {
            character.takeControl()
          } else if (this.driver === 'ai') {
            if (this.firstAINode !== undefined) {
              let nodeFound = false
              for (const pathName in world.paths) {
                if (world.paths.hasOwnProperty(pathName)) {
                  const path = world.paths[pathName]

                  for (const nodeName in path.nodes) {
                    if (Object.prototype.hasOwnProperty.call(path.nodes, nodeName)) {
                      const node = path.nodes[nodeName]

                      if (node.object.name === this.firstAINode) {
                        character.setBehaviour(new FollowPath(node, 10))
                        nodeFound = true
                      }
                    }
                  }
                }
              }

              if (!nodeFound) {
                console.error('Path node ' + this.firstAINode + 'not found.')
              }
            }
          }
        })
      }
    })
  }

  private getNewVehicleByType(model: any, type: string): Vehicle {
    switch (type) {
      case 'heli':
        return new Helicopter(model)
      case 'airplane':
        return new Airplane(model)
      case 'car':
      default:
        return new Car(model)
    }
  }
}
