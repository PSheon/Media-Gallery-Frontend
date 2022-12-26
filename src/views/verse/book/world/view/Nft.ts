import * as THREE from 'three'
import vjs from 'video.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import GifLoader from 'three-gif-loader'
import { TrimeshCollider } from 'src/views/verse/book/physics/colliders/TrimeshCollider'
import { World } from 'src/views/verse/book/world/World'
import { ISceneAsset } from 'src/types/sceneAssetTypes'

import apiConfig from 'src/configs/api'

export class Nft {
  // public frameId: string
  public object: THREE.Object3D
  public framePosition = ''

  private world: World
  private assetData: ISceneAsset['attributes']
  private dracoLoader: DRACOLoader
  private gltfLoader: GLTFLoader
  private gifLoader: GifLoader
  private textureLoader
  private streamingPlayer

  constructor(root: THREE.Object3D, world: World) {
    this.object = root
    this.framePosition = this.object.name
    this.world = world
    this.dracoLoader = new DRACOLoader()
    this.dracoLoader.setDecoderPath('/lib/draco/')
    this.gltfLoader = new GLTFLoader()
    this.gltfLoader.setDRACOLoader(this.dracoLoader)
    this.gifLoader = new GifLoader()
    this.textureLoader = new THREE.TextureLoader()

    if (root.userData.hasOwnProperty('position')) {
      this.framePosition = root.userData.position
    }

    const phys = new TrimeshCollider(this.object, {})
    phys.body.objectType = 'asset'
    phys.body.objectMetadata = {
      framePosition: this.framePosition || this.object.name,
      displayName: this.object.name,
      position: {
        x: this.object.position.x,
        y: this.object.position.y,
        z: this.object.position.z
      },
      rotation: {
        x: this.object.rotation.x,
        y: this.object.rotation.y,
        z: this.object.rotation.z
      }
    }
    world.physicsBodyList.push(phys.body)
    world.physicsWorld.addBody(phys.body)

    const BASE_ASSET_DATA = {
      type: 'nft',
      cover: {},
      displayName: 'Empty',
      description: 'no description',
      framePosition: this.framePosition,
      coverFileType: 'png',
      views: 0,
      fetchStatus: 'fetching',
      fetchAttemptCount: 0,
      published: true
    } as ISceneAsset['attributes']

    const currentPlacedAsset = world.metadata.assetList.find(
      assetData => assetData?.attributes.framePosition === this.framePosition
    )

    if (currentPlacedAsset) {
      this.assetData = Object.assign(BASE_ASSET_DATA, currentPlacedAsset.attributes)
    } else {
      this.assetData = Object.assign(BASE_ASSET_DATA, {})
    }

    if (
      this.assetData.coverFileType === 'png' ||
      this.assetData.coverFileType === 'jpg' ||
      this.assetData.coverFileType === 'svg'
    ) {
      const imageURL = this.assetData.cover?.data?.attributes.url
        ? `${apiConfig.publicFolderUrl}${this.assetData.cover.data.attributes.url}`
        : '/images/verse/empty-asset.jpg'
      const texture = this.textureLoader.load(imageURL)
      texture.flipY = false
      texture.encoding = THREE.sRGBEncoding

      // @ts-ignore
      this.object.material.map = texture
    }

    if (this.assetData.coverFileType === 'gif') {
      const url = this.assetData.cover?.data?.attributes.url

      if (url) {
        const gifURL = `${apiConfig.publicFolderUrl}${url}`
        const texture = this.gifLoader.load(
          gifURL,
          () => undefined,
          () => undefined,
          () => undefined
        )
        texture.flipY = false
        texture.minFilter = THREE.LinearFilter
        texture.encoding = THREE.sRGBEncoding

        // @ts-ignore
        this.object.material.map = texture

        // @ts-ignore
        this.object.material.transparent = true
      } else {
        const texture = this.textureLoader.load('/images/verse/wrong-asset.jpg')
        texture.flipY = false
        texture.encoding = THREE.sRGBEncoding

        // @ts-ignore
        this.object.material.map = texture
      }
    }

    if (this.assetData.coverFileType === 'mp4') {
      const video = document.createElement('video')
      const url = this.assetData.cover?.data?.attributes.url
      if (url) {
        const videoURL = `${apiConfig.publicFolderUrl}${url}`
        const source = document.createElement('source')
        source.src = videoURL
        source.type = 'video/mp4'
        video.appendChild(source)
        video.playsInline = true
        video.loop = true
        video.muted = true
        video.autoplay = true
        video.crossOrigin = 'anonymous'
        this.streamingPlayer = vjs(video)
        this.streamingPlayer.play()
        const texture = new THREE.VideoTexture(video)
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        texture.format = THREE.RGBFormat
        texture.flipY = false

        // @ts-ignore
        this.object.material.map = texture
      } else {
        this.streamingPlayer = undefined
        const texture = this.textureLoader.load('/images/verse/wrong-asset.jpg')
        texture.flipY = false
        texture.encoding = THREE.sRGBEncoding

        // @ts-ignore
        this.object.material.map = texture
      }
    }
  }
}
