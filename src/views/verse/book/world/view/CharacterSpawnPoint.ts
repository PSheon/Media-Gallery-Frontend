import * as THREE from 'three'
import { ISpawnPoint } from 'src/views/verse/book/interfaces/view/ISpawnPoint'
import { World } from 'src/views/verse/book/world/World'
import { Character } from 'src/views/verse/book/characters/view/Character'
import { LoadingManager } from 'src/views/verse/book/core/view/LoadingManager'
import * as Utils from 'src/views/verse/book/core/FunctionLibrary'

export class CharacterSpawnPoint implements ISpawnPoint {
  private object: THREE.Object3D

  constructor(object: THREE.Object3D) {
    this.object = object
  }

  public spawn(loadingManager: LoadingManager, world: World): void {
    // NOTE
    const avatarModel = 'ship_bear'
    loadingManager.loadGLTF(`/assets/book/character/${avatarModel}.glb`, model => {
      const player = new Character(model)
      player.isPlayer = true
      world.localPlayer = player

      const worldPos = new THREE.Vector3()
      this.object.getWorldPosition(worldPos)
      player.setPosition(worldPos.x, worldPos.y, worldPos.z)

      const forward = Utils.getForward(this.object)
      player.setOrientation(forward, true)

      world.add(player)
      player.takeControl()
    })
  }
}
