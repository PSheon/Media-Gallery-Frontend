// @ts-ignore
import * as CANNON from 'src/views/verse/lib/cannon/cannon'
import * as THREE from 'three'
import * as Utils from 'src/views/verse/book/core/FunctionLibrary'
import { ICollider } from 'src/views/verse/book/interfaces/ICollider'

export class SphereCollider implements ICollider {
  public options: any
  public body: CANNON.Body

  // @ts-ignore
  public debugModel: THREE.Mesh

  constructor(options: any) {
    const defaults = {
      mass: 0,
      position: new CANNON.Vec3(),
      radius: 0.3,
      friction: 0.3
    }
    options = Utils.setDefaults(options, defaults)
    this.options = options

    const mat = new CANNON.Material('sphereMat')
    mat.friction = options.friction

    const shape = new CANNON.Sphere(options.radius)

    // shape.material = mat;

    // Add phys sphere
    const physSphere = new CANNON.Body({
      mass: options.mass,
      position: options.position,
      shape
    })
    physSphere.material = mat

    this.body = physSphere
  }
}