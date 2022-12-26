import * as THREE from 'three'
import { ISpawnPoint } from 'src/views/verse/book/interfaces/view/ISpawnPoint'
import { World } from 'src/views/verse/book/world/World'
import { Character } from 'src/views/verse/book/characters/view/Character'
import { LoadingManager } from 'src/views/verse/book/core/view/LoadingManager'
import * as Utils from 'src/views/verse/book/core/FunctionLibrary'

import { FollowTarget } from 'src/views/verse/book/characters/view/character_ai/FollowTarget'
import { RandomBehaviour } from 'src/views/verse/book/characters/view/character_ai/RandomBehaviour'

export class NpcSpawnPoint implements ISpawnPoint {
  private object: THREE.Object3D

  constructor(object: THREE.Object3D) {
    this.object = object
  }

  public spawn(loadingManager: LoadingManager, world: World): void {
    const npcModel = this.object.userData?.model ?? 'shark_boy'
    loadingManager.loadGLTF(`/assets/book/character/draco-${npcModel}.glb`, model => {
      const npc = new Character(model)
      npc.setMetadata({
        objectType: 'npc',
        objectMetadata: {
          framePosition: this.object.name,
          displayName: this.object.userData?.displayName ?? 'Bob',
          position: { x: this.object.position.x, y: this.object.position.y, z: this.object.position.z },
          rotation: { x: this.object.rotation.x, y: this.object.rotation.y, z: this.object.rotation.z }
        }
      })
      npc.setLabelVisible(world.params.Label_Visible)

      const worldPos = new THREE.Vector3()
      this.object.getWorldPosition(worldPos)
      npc.setPosition(worldPos.x, worldPos.y, worldPos.z)

      const forward = Utils.getForward(this.object)
      npc.setOrientation(forward, true)

      if (this.object.userData?.behaviour === 'follow-player') {
        npc.setBehaviour(new FollowTarget(world.localPlayer!))
      }
      if (this.object.userData?.behaviour === 'random') {
        npc.setBehaviour(new RandomBehaviour())
      }

      world.add(npc)
    })
  }
}
