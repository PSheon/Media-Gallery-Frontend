import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { TrimeshCollider } from 'src/views/verse/book/physics/colliders/TrimeshCollider'
import { World } from 'src/views/verse/book/world/World'
import { INftMetadata } from 'src/views/verse/book/interfaces/INftMetadata'

export class Nft {
  public frameId: string
  public object: THREE.Object3D

  private world: World
  private dracoLoader: DRACOLoader
  private gltfLoader: GLTFLoader
  private textureLoader

  constructor(root: THREE.Object3D, world: World) {
    this.frameId = root.name
    this.object = root
    this.world = world
    this.dracoLoader = new DRACOLoader()
    this.dracoLoader.setDecoderPath('/lib/draco/')
    this.gltfLoader = new GLTFLoader()
    this.gltfLoader.setDRACOLoader(this.dracoLoader)
    this.textureLoader = new THREE.TextureLoader()

    const phys = new TrimeshCollider(this.object, {})
    phys.body.displayName = this.object.name
    phys.body.objectType = 'artwork'
    world.physicsBodyList.push(phys.body)
    world.physicsWorld.addBody(phys.body)

    const nftData = Object.assign(
      { type: 'image', displayName: 'Error', displayURL: '/images/logos/media-app.png' },
      world.metadata.nftList.find(nftData => nftData.frameId === this.frameId)
    )

    if (nftData.type === 'image') {
      const texture = this.textureLoader.load(nftData.displayURL)
      texture.flipY = false
      texture.encoding = THREE.sRGBEncoding
      this.object.material.map = texture
    }
  }

  update(newNftFrameMetadata: INftMetadata) {
    if (newNftFrameMetadata.type === 'image') {
      const texture = this.textureLoader.load(newNftFrameMetadata.displayURL)
      texture.flipY = false
      texture.encoding = THREE.sRGBEncoding
      this.object.material.map = texture
    }
  }
}
