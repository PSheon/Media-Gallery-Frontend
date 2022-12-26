import * as THREE from 'three'

// @ts-ignore
import { default as CSM } from 'three-csm'
import { SkyShader } from 'src/views/verse/lib/shaders/SkyShader'
import { World } from 'src/views/verse/book/world/World'
import { IUpdatable } from 'src/views/verse/book/interfaces/IUpdatable'

export class Sky extends THREE.Object3D implements IUpdatable {
  public updateOrder = 5

  public sunPosition: THREE.Vector3 = new THREE.Vector3()
  public csm: CSM

  set theta(value: number) {
    this._theta = value
    this.refreshSunPosition()
  }

  set phi(value: number) {
    this._phi = value
    this.refreshSunPosition()
    this.refreshHemiIntensity()
  }

  private _phi = 50
  private _theta = 145

  private hemiLight: THREE.HemisphereLight
  private maxHemiIntensity = 2.1
  private minHemiIntensity = 1.9

  private skyMesh: THREE.Mesh
  private skyMaterial: THREE.ShaderMaterial

  private world: World

  constructor(world: World) {
    super()

    this.world = world

    // Sky material
    this.skyMaterial = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(SkyShader.uniforms),
      fragmentShader: SkyShader.fragmentShader,
      vertexShader: SkyShader.vertexShader,
      side: THREE.BackSide
    })

    // Mesh
    this.skyMesh = new THREE.Mesh(new THREE.SphereBufferGeometry(1000, 24, 12), this.skyMaterial)
    this.attach(this.skyMesh)

    // Ambient light
    this.hemiLight = new THREE.HemisphereLight(0xb1e1ff, 0xb97a20, 1.0)
    this.refreshHemiIntensity()
    this.hemiLight.color.setHSL(0.59, 0.4, 0.6)
    this.hemiLight.groundColor.setHSL(0.095, 0.2, 0.75)
    this.hemiLight.position.set(0, 50, 0)
    this.world.graphicsWorld.add(this.hemiLight)

    // CSM
    // New version
    // let splitsCallback = (amount, near, far, target) =>
    // {
    // 	for (let i = amount - 1; i >= 0; i--)
    // 	{
    // 		target.push(Math.pow(1 / 3, i));
    // 	}
    // };

    // Legacy
    const splitsCallback = (amount: number): number[] => {
      const arr: number[] = []

      for (let i = amount - 1; i >= 0; i--) {
        arr.push(Math.pow(1 / 4, i))
      }

      return arr
    }

    this.csm = new CSM({
      fov: 80,
      far: 250, // maxFar
      lightIntensity: 2.5,
      cascades: 3,
      shadowMapSize: 2048,
      camera: world.camera,
      parent: world.graphicsWorld,
      mode: 'custom',
      customSplitsCallback: splitsCallback
    })
    this.csm.fade = true

    this.refreshSunPosition()

    world.graphicsWorld.add(this)
    world.registerUpdatable(this)
  }

  // eslint-disable-next-line
  public update(timeScale: number): void {
    this.position.copy(this.world.camera.position)
    this.refreshSunPosition()

    this.csm.update(this.world.camera.matrix)
    this.csm.lightDirection = new THREE.Vector3(
      -this.sunPosition.x,
      -this.sunPosition.y,
      -this.sunPosition.z
    ).normalize()

    const linearTransformation = (secondPercentage: number, t1 = 2 / 9, t2 = 7 / 9) => {
      if (0 <= secondPercentage && secondPercentage < t1) {
        return (secondPercentage / t1) * (1 / 3)
      } else if (t1 <= secondPercentage && secondPercentage < t2) {
        return 1 / 3 + ((secondPercentage - t1) / (t2 - t1)) * (1 / 3)
      } else if (t2 <= secondPercentage && secondPercentage < 1) {
        return 2 / 3 + ((secondPercentage - t2) / (1 - t2)) * (1 / 3)
      } else {
        return 1
      }
    }

    const angleToPhi = (anglePercentage: number) => {
      if (0 <= anglePercentage && anglePercentage < 0.5) {
        return Math.sin(anglePercentage * Math.PI) * 90
      } else if (0.5 <= anglePercentage && anglePercentage <= 1) {
        return (1 + (1 - Math.sin(anglePercentage * Math.PI))) * 90
      }
    }

    const milliseconds =
      (new Date().getMinutes() % 5) * 60 * 1000 + (new Date().getSeconds() % 60) * 1000 + new Date().getMilliseconds()
    const secondPercentage = milliseconds / (5 * 60 * 1000)

    const thetaSeconds =
      new Date().getMinutes() * 60 * 1000 + (new Date().getSeconds() % 60) * 1000 + new Date().getMilliseconds()
    const thetaSecondPercentage = thetaSeconds / (60 * 60 * 1000)

    const newPhi = angleToPhi(linearTransformation(secondPercentage)) as number

    this._phi = newPhi
    this._theta = thetaSecondPercentage * 360
  }

  public refreshSunPosition(): void {
    const sunDistance = 10

    this.sunPosition.x = sunDistance * Math.sin((this._theta * Math.PI) / 180) * Math.cos((this._phi * Math.PI) / 180)
    this.sunPosition.y = sunDistance * Math.sin((this._phi * Math.PI) / 180)
    this.sunPosition.z = sunDistance * Math.cos((this._theta * Math.PI) / 180) * Math.cos((this._phi * Math.PI) / 180)

    this.skyMaterial.uniforms.sunPosition.value.copy(this.sunPosition)
    this.skyMaterial.uniforms.cameraPos.value.copy(this.world.camera.position)
  }

  public refreshHemiIntensity(): void {
    this.hemiLight.intensity =
      this.minHemiIntensity +
      Math.pow(1 - Math.abs(this._phi - 90) / 90, 0.25) * (this.maxHemiIntensity - this.minHemiIntensity)
  }
}
