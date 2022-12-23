import * as THREE from 'three'

import { World } from 'src/views/verse/book/world/EditWorld'
import { WaterShader } from 'src/views/verse/lib/shaders/WaterShader'
import { IUpdatable } from 'src/views/verse/book/interfaces/IUpdatable'

export class Ocean implements IUpdatable {
  public updateOrder = 10
  public material: THREE.ShaderMaterial

  private world: World

  constructor(object: any, world: World) {
    this.world = world

    const uniforms = THREE.UniformsUtils.clone(WaterShader.uniforms)
    uniforms.iResolution.value.x = window.innerWidth
    uniforms.iResolution.value.y = window.innerHeight

    this.material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      fragmentShader: WaterShader.fragmentShader,
      vertexShader: WaterShader.vertexShader
    })

    object.material = this.material
    object.material.transparent = true
  }

  public update(timeStep: number): void {
    this.material.uniforms.cameraPos.value.copy(this.world.camera.position)
    this.material.uniforms.lightDir.value.copy(new THREE.Vector3().copy(this.world.sky.sunPosition).normalize())
    this.material.uniforms.iGlobalTime.value += timeStep
  }
}