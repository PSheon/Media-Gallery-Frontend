import * as THREE from 'three'
import * as CANNON from 'src/views/verse/lib/cannon/cannon'

import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer'
import { CameraOperator } from 'src/views/verse/book/core/view/CameraOperator'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'

import { Detector } from 'src/views/verse/lib/utils/Detector'
import { Stats } from 'src/views/verse/lib/utils/Stats'
import { ColyseusClient } from 'src/views/verse/lib/utils/Network'

import { CannonDebugRenderer } from 'src/views/verse/lib/cannon/CannonDebugRenderer'
import toast from 'react-hot-toast'
import { Room } from 'colyseus.js'
import * as _ from 'lodash'

import { InputManager } from 'src/views/verse/book/core/view/InputManager'
import * as Utils from 'src/views/verse/book/core/FunctionLibrary'
import { LoadingManager } from 'src/views/verse/book/core/view/LoadingManager'
import { InfoStack } from 'src/views/verse/book/core/InfoStack'
import { UIManager } from 'src/views/verse/book/core/view/UIManager'
import { IWorldMetadata } from 'src/views/verse/book/interfaces/IWorldMetadata'
import { INftMetadata } from 'src/views/verse/book/interfaces/INftMetadata'
import { IWorldEntity } from 'src/views/verse/book/interfaces/view/IWorldEntity'
import { IUpdatable } from 'src/views/verse/book/interfaces/IUpdatable'
import { IParams } from 'src/views/verse/book/interfaces/IParams'
import { Character } from 'src/views/verse/book/characters/view/Character'
import { CollisionGroups } from 'src/views/verse/book/enums/CollisionGroups'
import { BoxCollider } from 'src/views/verse/book/physics/colliders/BoxCollider'
import { TrimeshCollider } from 'src/views/verse/book/physics/colliders/TrimeshCollider'
import { Vehicle } from 'src/views/verse/book/vehicles/Vehicle'
import { Scenario } from 'src/views/verse/book/world/view/Scenario'
import { Path } from 'src/views/verse/book/world/Path'
import { Nft } from 'src/views/verse/book/world/view/Nft'
import { Sky } from 'src/views/verse/book/world/view/Sky'
import { Ocean } from 'src/views/verse/book/world/view/Ocean'

import {
  SHOW_START_PANEL_ACTION,
  SET_START_PANEL_ACTION,
  SET_CONTROL_HINT_BOX_ACTION
} from 'src/views/verse/book/actions/view'

export class World {
  public renderer: THREE.WebGLRenderer
  public labelRenderer: CSS2DRenderer
  public camera: THREE.PerspectiveCamera
  public composer: any
  public stats: Stats
  public graphicsWorld: THREE.Scene
  public sky: Sky
  public room: Room | undefined
  public physicsWorld: CANNON.World
  public physicsFrameRate: number
  public physicsFrameTime: number
  public physicsMaxPrediction: number
  public scope: World
  public clock: THREE.Clock
  public renderDelta: number
  public logicDelta: number
  public requestDelta: number
  public sinceLastFrame: number
  public justRendered: boolean
  public inputManager: InputManager
  public cameraOperator: CameraOperator
  public timeScaleTarget = 1
  public console: InfoStack
  public cursorBox: THREE.Mesh
  public cannonDebugRenderer: CannonDebugRenderer | undefined
  public scenarios: Scenario[] = []
  public gltfScenes: THREE.Scene[] = []
  public physicsBodyList: CANNON.body[] = []
  public visitors: Record<string, Character> = {}
  public characters: Character[] = []
  public vehicles: Vehicle[] = []
  public nfts: Nft[] = []
  public paths: Path[] = []
  public updatableList: IUpdatable[] = []
  public mixer: Record<string, THREE.AnimationMixer> = {}
  public localPlayer: Character | undefined = undefined
  public dialogMode = false
  public metadata: IWorldMetadata = {
    owner: '',
    displayName: '',
    description: '',
    worldScenePaths: [],
    nftList: []

    // allowedVisitors: [] // NOTE
  }
  public params: IParams = {
    Label_Visible:
      localStorage.getItem('media_verse_settings-label-visible') !== null
        ? JSON.parse(localStorage.getItem('media_verse_settings-label-visible')!)
        : true,
    Pointer_Lock:
      localStorage.getItem('media_verse_settings-pointer-lock') !== null
        ? JSON.parse(localStorage.getItem('media_verse_settings-pointer-lock')!)
        : true,
    Mouse_Sensitivity: 0.3,
    Time_Scale: 0,
    Shadows:
      localStorage.getItem('media_verse_settings-shadows') !== null
        ? JSON.parse(localStorage.getItem('media_verse_settings-shadows')!)
        : true,
    FXAA:
      localStorage.getItem('media_verse_settings-anti-alias') !== null
        ? JSON.parse(localStorage.getItem('media_verse_settings-shadows')!)
        : true,
    Debug_Physics: false,
    Debug_FPS: false,
    Sun_Elevation: 50,
    Sun_Rotation: 145
  }

  private lastScenarioID: string | undefined

  constructor() {
    const scope = this
    this.scope = scope

    // WebGL not supported
    if (!Detector.webgl) {
      window.location.assign('/verse/un-supported')
    }

    // Renderer
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.0
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

    // Label Renderer
    this.labelRenderer = new CSS2DRenderer()
    this.labelRenderer.setSize(window.innerWidth, window.innerHeight)
    this.labelRenderer.domElement.style.position = 'absolute'
    this.labelRenderer.domElement.style.top = '0px'
    this.labelRenderer.domElement.style.pointerEvents = 'none'

    this.generateHTML()

    // Auto window resize
    function onWindowResize(): void {
      scope.camera.aspect = window.innerWidth / window.innerHeight
      scope.camera.updateProjectionMatrix()
      scope.renderer.setSize(window.innerWidth, window.innerHeight)
      scope.labelRenderer.setSize(window.innerWidth, window.innerHeight)
      fxaaPass.uniforms['resolution'].value.set(
        1 / (window.innerWidth * pixelRatio),
        1 / (window.innerHeight * pixelRatio)
      )
      scope.composer.setSize(window.innerWidth * pixelRatio, window.innerHeight * pixelRatio)
    }
    window.addEventListener('resize', onWindowResize, false)

    // Three.js scene
    this.graphicsWorld = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1010)
    this.camera.position.setY(1.5)

    // Passes
    const renderPass = new RenderPass(this.graphicsWorld, this.camera)
    const fxaaPass = new ShaderPass(FXAAShader)

    // FXAA
    const pixelRatio = this.renderer.getPixelRatio()
    fxaaPass.material['uniforms'].resolution.value.x = 1 / (window.innerWidth * pixelRatio)
    fxaaPass.material['uniforms'].resolution.value.y = 1 / (window.innerHeight * pixelRatio)

    // Composer
    this.composer = new EffectComposer(this.renderer)
    this.composer.addPass(renderPass)
    this.composer.addPass(fxaaPass)

    // Physics
    this.physicsWorld = new CANNON.World()
    this.physicsWorld.gravity.set(0, -9.81, 0)
    this.physicsWorld.broadphase = new CANNON.SAPBroadphase(this.physicsWorld)
    this.physicsWorld.solver.iterations = 10
    this.physicsWorld.allowSleep = true

    this.physicsFrameRate = 60
    this.physicsFrameTime = 1 / this.physicsFrameRate
    this.physicsMaxPrediction = this.physicsFrameRate

    // RenderLoop
    this.clock = new THREE.Clock()
    this.renderDelta = 0
    this.logicDelta = 0
    this.sinceLastFrame = 0
    this.justRendered = false

    // Stats (FPS, Frame time, Memory)
    this.stats = Stats()

    // Initialization
    this.inputManager = new InputManager(this, this.renderer.domElement)
    this.cameraOperator = new CameraOperator(this, this.camera, this.params.Mouse_Sensitivity)
    this.sky = new Sky(this)

    this.initScene()

    // Cursor
    this.cursorBox = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 20, 20),
      new THREE.MeshLambertMaterial({
        color: 0xced3dc,
        opacity: 0.3,
        transparent: true
      })
    )
    this.graphicsWorld.add(this.cursorBox)

    this.adjustShadows(this.params.Shadows)
    this.adjustPointerLock(this.params.Pointer_Lock)

    this.render(this)
  }

  public async initScene() {
    await this.setSceneMetadata()
    const worldScenePaths = this.metadata.worldScenePaths

    worldScenePaths.forEach((worldScenePath, loadingOrder) => {
      // Load scene if path is supplied
      const loadingManager = new LoadingManager(this)
      if (loadingOrder === 0) {
        loadingManager.onFinishedCallback = () => {
          this.update(1, 1)
          this.setTimeScale(1)

          UIManager.setLoadingScreenVisible(false)

          SHOW_START_PANEL_ACTION()
          SET_START_PANEL_ACTION({
            title: 'Welcome to Media Verse!',
            content: 'Feel free to explore the world and interact with available vehicles.',
            confirmButtonText: "Let's GO!",
            closeCallback: () => {
              UIManager.setUserInterfaceVisible(true)
            }
          })
        }
      }
      loadingManager.loadGLTF(worldScenePath, gltf => {
        this.loadScene(loadingManager, gltf)
      })
    })
  }

  /* TODO integrate backend function */
  async setSceneMetadata() {
    this.metadata = {
      owner: 'owner',
      displayName: 'Display Name',
      description: 'Description',
      worldScenePaths: [
        '/assets/glb/scene/advanced-gallery/draco-p1.glb',
        '/assets/glb/scene/advanced-gallery/draco-p2.glb',
        '/assets/glb/scene/advanced-gallery/draco-p3.glb',
        '/assets/glb/scene/advanced-gallery/draco-p4.glb',
        '/assets/glb/scene/advanced-gallery/draco-p5.glb',
        '/assets/glb/scene/advanced-gallery/draco-p6.glb',
        '/assets/glb/scene/advanced-gallery/draco-p7.glb',
        '/assets/glb/scene/advanced-gallery/draco-p8.glb'
      ],
      nftList: []
    }
  }

  public setDialogMode(newDialogMode: boolean): void {
    this.dialogMode = newDialogMode
  }

  // Update
  // Handles all logic updates.
  public update(timeStep: number, unscaledTimeStep: number): void {
    this.updatePhysics(timeStep)

    // Update registred objects
    this.updatableList.forEach(entity => {
      entity.update(timeStep, unscaledTimeStep)
    })

    Object.values(this.mixer).forEach(item => {
      item.update(timeStep)
    })

    // Lerp time scale
    this.params.Time_Scale = THREE.MathUtils.lerp(this.params.Time_Scale, this.timeScaleTarget, 0.2)

    // Physics debug
    if (this.params.Debug_Physics) this.cannonDebugRenderer?.update()
  }

  public updatePhysics(timeStep: number): void {
    // Step the physics world
    this.physicsWorld.step(this.physicsFrameTime, timeStep)

    this.characters.forEach(char => {
      if (this.isOutOfBounds(char.characterCapsule.body.position)) {
        this.outOfBoundsRespawn(char.characterCapsule.body)
      }
    })

    this.vehicles.forEach(vehicle => {
      if (this.isOutOfBounds(vehicle.rayCastVehicle.chassisBody.position)) {
        const worldPos = new THREE.Vector3()
        vehicle.spawnPoint.getWorldPosition(worldPos)
        worldPos.y += 1
        this.outOfBoundsRespawn(vehicle.rayCastVehicle.chassisBody, Utils.cannonVector(worldPos))
      }
    })
  }

  public isOutOfBounds(position: CANNON.Vec3): boolean {
    const inside =
      position.x > -211.882 &&
      position.x < 211.882 &&
      position.z > -169.098 &&
      position.z < 153.232 &&
      position.y > 0.107
    const belowSeaLevel = position.y < -50.989

    return !inside && belowSeaLevel
  }

  public outOfBoundsRespawn(body: CANNON.Body, position?: CANNON.Vec3): void {
    const newPos = position || new CANNON.Vec3(0, 16, 0)
    const newQuat = new CANNON.Quaternion(0, 0, 0, 1)

    body.position.copy(newPos)
    body.interpolatedPosition.copy(newPos)
    body.quaternion.copy(newQuat)
    body.interpolatedQuaternion.copy(newQuat)
    body.velocity.setZero()
    body.angularVelocity.setZero()
  }

  /**
   * Rendering loop.
   * Implements fps limiter and frame-skipping
   * Calls world's "update" function before rendering.
   * @param {World} world
   */
  public render(world: World): void {
    this.requestDelta = this.clock.getDelta()

    requestAnimationFrame(() => {
      world.render(world)
    })

    // Getting timeStep
    const unscaledTimeStep = this.requestDelta + this.renderDelta + this.logicDelta
    let timeStep = unscaledTimeStep * this.params.Time_Scale
    timeStep = Math.min(timeStep, 1 / 30) // min 30 fps

    // Logic
    world.update(timeStep, unscaledTimeStep)

    // Measuring logic time
    this.logicDelta = this.clock.getDelta()

    // Frame limiting
    const interval = 1 / 60
    this.sinceLastFrame += this.requestDelta + this.renderDelta + this.logicDelta
    this.sinceLastFrame %= interval

    // Stats end
    this.stats.end()
    this.stats.begin()

    // Actual rendering with a FXAA ON/OFF switch
    if (window.innerWidth > 768) {
      if (this.params.FXAA) this.composer.render()
      else this.renderer.render(this.graphicsWorld, this.camera)
    } else {
      this.renderer.render(this.graphicsWorld, this.camera)
    }

    this.labelRenderer.render(this.graphicsWorld, this.camera)

    // Measuring render time
    this.renderDelta = this.clock.getDelta()
  }

  public setTimeScale(value: number): void {
    this.params.Time_Scale = value
    this.timeScaleTarget = value
  }

  public add(worldEntity: IWorldEntity): void {
    worldEntity.addToWorld(this)
    this.registerUpdatable(worldEntity)
  }

  public registerUpdatable(registree: IUpdatable): void {
    this.updatableList.push(registree)
    this.updatableList.sort((a, b) => (a.updateOrder > b.updateOrder ? 1 : -1))
  }

  public remove(worldEntity: IWorldEntity): void {
    worldEntity.removeFromWorld(this)
    this.unregisterUpdatable(worldEntity)
  }

  public unregisterUpdatable(registree: IUpdatable): void {
    _.pull(this.updatableList, registree)
  }

  public loadScene(loadingManager: LoadingManager, gltf: GLTF): void {
    let launch = false
    gltf.scene.traverse(child => {
      if (child.hasOwnProperty('userData')) {
        if (child.type === 'Mesh') {
          Utils.setupMeshProperties(child)
          this.sky.csm.setupMaterial(child.material)

          if (child.material.name === 'ocean') {
            this.registerUpdatable(new Ocean(child, this))
          }
        }

        if (child.userData.hasOwnProperty('data')) {
          if (child.userData.data === 'physics') {
            if (child.userData.hasOwnProperty('type')) {
              // Convex doesn't work! Stick to boxes!
              if (child.userData.type === 'box') {
                const phys = new BoxCollider({
                  size: new THREE.Vector3(child.scale.x, child.scale.y, child.scale.z)
                })
                phys.body.position.copy(Utils.cannonVector(child.position))
                phys.body.quaternion.copy(Utils.cannonQuat(child.quaternion))
                phys.body.computeAABB()

                phys.body.shapes.forEach(shape => {
                  shape.collisionFilterMask = ~CollisionGroups.TrimeshColliders
                })

                this.physicsWorld.addBody(phys.body)
                this.physicsBodyList.push(phys.body)
              } else if (child.userData.type === 'trimesh') {
                const phys = new TrimeshCollider(child, {})
                this.physicsWorld.addBody(phys.body)
                this.physicsBodyList.push(phys.body)
              }

              child.visible = false
            }
          }

          if (child.userData.data === 'artwork') {
            this.nfts.push(new Nft(child, this))
          }

          if (child.userData.data === 'path') {
            this.paths.push(new Path(child))
          }

          if (child.userData.data === 'scenario') {
            launch = true
            this.scenarios.push(new Scenario(child, this))
          }
        }

        if (child.userData.hasOwnProperty('animation')) {
          this.mixer[child.name] = new THREE.AnimationMixer(child)
          const clips = gltf.animations

          const clip = THREE.AnimationClip.findByName(clips, child.userData.animation)
          this.mixer[child.name].clipAction(clip).play()
        }
      }
    })

    this.gltfScenes.push(gltf.scene)
    this.graphicsWorld.add(gltf.scene)

    // Launch default scenario
    let defaultScenarioID = ''
    for (const scenario of this.scenarios) {
      if (scenario.default) {
        defaultScenarioID = scenario.id
        break
      }
    }
    if (launch && defaultScenarioID !== '') {
      this.launchScenario(defaultScenarioID, loadingManager)

      this.joinMultiPlayerRoom(loadingManager)
    }
  }

  public launchScenario(scenarioID: string, loadingManager?: LoadingManager): void {
    this.lastScenarioID = scenarioID

    if (this.localPlayer) {
      this.localPlayer.removeFromWorld(this)
      this.localPlayer = undefined
    }

    this.clearEntities()

    // Launch default scenario
    if (!loadingManager) loadingManager = new LoadingManager(this)
    loadingManager.isRestartLoading = true
    for (const scenario of this.scenarios) {
      if (scenario.id === scenarioID || scenario.spawnAlways) {
        scenario.launch(loadingManager, this)
      }
    }
  }

  public joinMultiPlayerRoom(loadingManager: LoadingManager): void {
    // NOTE
    ColyseusClient.joinOrCreate('game', {
      // sceneId: getState().verse.scene.sceneId,
      // moralisId: getState().verse.identity.moralisId,
      // displayName: getState().verse.identity.displayName,
      // photoURL: getState().verse.identity.photoURL,
      // avatarModel: getState().verse.identity.avatarModel
      sceneId: 'test',
      moralisId: 'test',
      displayName: 'test',
      photoURL: 'test',
      avatarModel: 'ship_bear'
    })
      .then(room => {
        this.room = room
        const gltfLoader = loadingManager.gltfLoader

        room.state.players.onAdd = (player, sessionId) => {
          if (room.sessionId !== sessionId) {
            gltfLoader.load(`/assets/glb/character/${player.metadata.avatarModel}.glb`, model => {
              toast.success(`${player.metadata.displayName} joined!`)
              const visitor = new Character(model)

              visitor.setMetadata({
                displayName: `Player #${player.metadata.displayName}`,
                objectType: 'player'
              })
              visitor.setLabelVisible(this.params.Label_Visible)

              this.add(visitor)
              this.visitors[sessionId] = visitor

              visitor.setPosition(player.position.x, player.position.y, player.position.z)

              // Update player metadata based on changes from the server.
              player.metadata.onChange = changes => {
                changes.forEach(change => {
                  if (change.field === 'displayName') {
                    this.visitors[sessionId].setMetadata({
                      displayName: `Player #${player.metadata.displayName}`,
                      objectType: 'player'
                    })
                  }
                  if (change.field === 'avatarModel') {
                    this.visitors[sessionId].changeAvatar(player.metadata.avatarModel)
                  }
                })
              }

              // Update player position based on changes from the server.
              player.position.onChange = () => {
                this.visitors[sessionId].setPosition(player.position.x, player.position.y, player.position.z)
              }

              // Update player viewVector based on changes from the server.
              player.viewVector.onChange = () => {
                this.visitors[sessionId].viewVector.x = player.viewVector.x
                this.visitors[sessionId].viewVector.y = player.viewVector.y
                this.visitors[sessionId].viewVector.z = player.viewVector.z
              }

              // Update player orientation based on changes from the server.
              player.orientation.onChange = () => {
                this.visitors[sessionId].orientation.x = player.orientation.x
                this.visitors[sessionId].orientation.y = player.orientation.y
                this.visitors[sessionId].orientation.z = player.orientation.z
              }

              // Update player action based on changes from the server.
              player.action.onChange = () => {
                this.visitors[sessionId].triggerAction(player.action.key, player.action.pressed)
              }

              // Update player animation based on changes from the server.
              player.animation.onChange = () => {
                this.visitors[sessionId].playAnimationClip(player.animation.clip)
              }
            })
          }
        }

        room.state.players.onRemove = (player, sessionId: string): void => {
          this.visitors[sessionId].removeFromWorld(this)
          delete this.visitors[sessionId]
        }
      })
      .catch(roomError => {
        console.log('roomError, ', roomError)
        toast.error('Join room failed')
      })
  }

  public restartScenario(): void {
    if (this.lastScenarioID !== undefined) {
      document.exitPointerLock()
      this.launchScenario(this.lastScenarioID)
    } else {
      console.warn("Can't restart scenario. Last scenarioID is undefined.")
    }
  }

  public clearEntities(): void {
    for (let i = 0; i < this.characters.length; i++) {
      this.remove(this.characters[i])
      i--
    }

    for (let i = 0; i < this.vehicles.length; i++) {
      this.remove(this.vehicles[i])
      i--
    }
  }

  public scrollTheTimeScale(scrollAmount: number): void {
    // Changing time scale with scroll wheel
    const timeScaleBottomLimit = 0.003
    const timeScaleChangeSpeed = 1.3

    if (scrollAmount > 0) {
      this.timeScaleTarget /= timeScaleChangeSpeed
      if (this.timeScaleTarget < timeScaleBottomLimit) this.timeScaleTarget = 0
    } else {
      this.timeScaleTarget *= timeScaleChangeSpeed
      if (this.timeScaleTarget < timeScaleBottomLimit) this.timeScaleTarget = timeScaleBottomLimit
      this.timeScaleTarget = Math.min(this.timeScaleTarget, 1)
    }
  }

  public updateControls(controls: any): void {
    SET_CONTROL_HINT_BOX_ACTION({
      title: 'Controls',
      content: controls
    })
  }

  private generateHTML(): void {
    // Canvas
    const worldDom = document.getElementById('world') as HTMLElement

    worldDom.appendChild(this.renderer.domElement)
    worldDom.appendChild(this.labelRenderer.domElement)
    this.renderer.domElement.id = 'canvas'
    this.labelRenderer.domElement.id = 'label-canvas'
  }

  public updateNftFrame(frameId: string, newNftMetadata: INftMetadata) {
    const selectedNft = this.nfts.find(nft => nft.frameId === frameId)
    if (selectedNft) {
      selectedNft.update(newNftMetadata)
    }
  }

  adjustLabelVisible(newLabelVisible: boolean): void {
    if (newLabelVisible) {
      this.characters.forEach(char => {
        char.setLabelVisible(true)
      })
      Object.values(this.visitors).forEach(visitor => {
        visitor.setLabelVisible(true)
      })
      this.params.Label_Visible = true
    } else {
      this.characters.forEach(char => {
        char.setLabelVisible(false)
      })
      Object.values(this.visitors).forEach(visitor => {
        visitor.setLabelVisible(false)
      })
      this.params.Label_Visible = false
    }
  }

  adjustShadows(newShadowsStatus: boolean): void {
    if (newShadowsStatus) {
      this.sky.csm.lights.forEach(light => {
        light.castShadow = true
      })
    } else {
      this.sky.csm.lights.forEach(light => {
        light.castShadow = false
      })
    }
  }

  adjustAntiAliasing(newAntiAliasingStatus: boolean): void {
    this.params.FXAA = newAntiAliasingStatus
  }

  adjustPointerLock(newPointerLockStatus: boolean): void {
    this.scope.inputManager.setPointerLock(newPointerLockStatus)
  }

  adjustPhysicDebug(newPhysicDebugStatus: boolean): void {
    if (newPhysicDebugStatus) {
      this.cannonDebugRenderer = new CannonDebugRenderer(this.graphicsWorld, this.physicsWorld)
      this.params.Debug_Physics = true
    } else {
      this.cannonDebugRenderer!.clearMeshes()
      this.cannonDebugRenderer = undefined
      this.params.Debug_Physics = false
    }
    this.scope.characters.forEach(char => {
      char.raycastBox.visible = newPhysicDebugStatus
      char.raycastHoverBox.visible = newPhysicDebugStatus
    })
  }

  adjustFpsDebug(newFpsDebugStatus: boolean): void {
    UIManager.setFPSVisible(newFpsDebugStatus)
  }

  public dispose() {
    if (this.room !== undefined) {
      this.room?.leave()
    }
    this.clearEntities()
    if (this.localPlayer) {
      this.localPlayer.removeFromWorld(this)
    }
    this.physicsBodyList.forEach(body => {
      this.physicsWorld.remove(body)
    })
    Object.values(this.visitors).forEach(visitor => {
      visitor.removeFromWorld(this)
    })

    this.renderer.renderLists.dispose()

    this.gltfScenes.forEach(scene => {
      scene.traverse(child => {
        if (child.removable) {
          child.geometry.dispose()
          child.material.dispose()
        }
      })

      this.graphicsWorld.remove(scene)
    })

    this.room = undefined
    this.localPlayer = undefined
    this.scenarios = []

    this.gltfScenes = []
    this.physicsBodyList = []
    this.vehicles = []
    this.visitors = {}
    this.nfts = []
  }

  /* TODO: optimize clean steps */
  public restartScene() {
    this.dispose()

    this.initScene()
  }

  public destroy() {
    /* NOTE: trick to prevent memory leak */
    this.render = () => undefined
  }
}
