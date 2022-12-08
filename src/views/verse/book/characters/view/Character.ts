import * as THREE from 'three'

// @ts-ignore
import * as CANNON from 'src/views/verse/lib/cannon/cannon'
import * as _ from 'lodash'
import * as Utils from 'src/views/verse/book/core/FunctionLibrary'

import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { KeyBinding } from 'src/views/verse/book/core/KeyBinding'
import { VectorSpringSimulator } from 'src/views/verse/book/physics/spring_simulation/VectorSpringSimulator'
import { RelativeSpringSimulator } from 'src/views/verse/book/physics/spring_simulation/RelativeSpringSimulator'
import { EnteringVehicle } from 'src/views/verse/book/characters/view/character_states/vehicles/EnteringVehicle'
import { ExitingVehicle } from 'src/views/verse/book/characters/view/character_states/vehicles/ExitingVehicle'
import { OpenVehicleDoor as OpenVehicleDoor } from 'src/views/verse/book/characters/view/character_states/vehicles/OpenVehicleDoor'
import { Driving } from 'src/views/verse/book/characters/view/character_states/vehicles/Driving'
import { ExitingAirplane } from 'src/views/verse/book/characters/view/character_states/vehicles/ExitingAirplane'
import { ICharacterAI } from 'src/views/verse/book/interfaces/ICharacterAI'
import { World } from 'src/views/verse/book/world/World'
import { ICharacterMetadata } from 'src/views/verse/book/interfaces/ICharacterMetadata'
import { IControllable } from 'src/views/verse/book/interfaces/IControllable'
import { ICharacterState } from 'src/views/verse/book/interfaces/ICharacterState'
import { IWorldEntity } from 'src/views/verse/book/interfaces/view/IWorldEntity'
import { VehicleSeat } from 'src/views/verse/book/vehicles/view/VehicleSeat'
import { Vehicle } from 'src/views/verse/book/vehicles/view/Vehicle'
import { Idle } from 'src/views/verse/book/characters/view/character_states/Idle'
import { CollisionGroups } from 'src/views/verse/book/enums/CollisionGroups'
import { CapsuleCollider } from 'src/views/verse/book/physics/colliders/CapsuleCollider'
import { VehicleEntryInstance } from 'src/views/verse/book/characters/view/VehicleEntryInstance'
import { SeatType } from 'src/views/verse/book/enums/SeatType'
import { GroundImpactData } from 'src/views/verse/book/characters/view/GroundImpactData'
import { ClosestObjectFinder } from 'src/views/verse/book/core/ClosestObjectFinder'
import { EntityType } from 'src/views/verse/book/enums/EntityType'
import { getAnimationDetails } from 'src/utils/get-character-animation-details'

import {
  SHOW_VIEW_DIALOG_BOX_ACTION,
  SET_VIEW_DIALOG_BOX_ACTION,
  UN_HOVER_VIEW_DIALOG_BOX_ACTION,
  HIDE_VIEW_DIALOG_BOX_ACTION
} from 'src/views/verse/book/actions/view'

export class Character extends THREE.Object3D implements IWorldEntity {
  public updateOrder = 1
  public entityType: EntityType = EntityType.Character
  public metadata: ICharacterMetadata = {
    displayName: 'MediaVerve',
    objectType: 'player'
  }
  public isPlayer = false
  public zoomLevel = 5
  public height = 0
  public tiltContainer: THREE.Group
  public modelContainer: THREE.Group
  public materials: THREE.Material[] = []
  public mixer: THREE.AnimationMixer

  // @ts-ignore
  public animations: any[]

  // @ts-ignore
  public currentClip: string

  // Movement
  public acceleration: THREE.Vector3 = new THREE.Vector3()
  public velocity: THREE.Vector3 = new THREE.Vector3()
  public arcadeVelocityInfluence: THREE.Vector3 = new THREE.Vector3()
  public velocityTarget: THREE.Vector3 = new THREE.Vector3()
  public arcadeVelocityIsAdditive = false

  public defaultVelocitySimulatorDamping = 0.8
  public defaultVelocitySimulatorMass = 50
  public velocitySimulator: VectorSpringSimulator
  public moveSpeed = 4
  public angularVelocity = 0
  public orientation: THREE.Vector3 = new THREE.Vector3(0, 0, 1)
  public orientationTarget: THREE.Vector3 = new THREE.Vector3(0, 0, 1)
  public defaultRotationSimulatorDamping = 0.5
  public defaultRotationSimulatorMass = 10
  public rotationSimulator: RelativeSpringSimulator
  public viewVector: THREE.Vector3
  public actions: { [action: string]: KeyBinding }
  public characterCapsule: CapsuleCollider
  public characterLabel: CSS2DObject | undefined

  // Ray casting
  public rayResult: CANNON.RaycastResult = new CANNON.RaycastResult()
  public rayHoverResult: CANNON.RaycastResult = new CANNON.RaycastResult()
  public rayHasHit = false
  public rayHoverHasHit = false
  public rayCastLength = 0.57
  public raySafeOffset = 0.03
  public wantsToJump = false
  public initJumpSpeed = -1
  public groundImpactData: GroundImpactData = new GroundImpactData()
  public raycastBox: THREE.Mesh
  public raycastHoverBox: THREE.Mesh
  public hoverObjectDisplayName: string | undefined
  public hoverObjectType: string | undefined

  public world: World | undefined

  // @ts-ignore
  public charState: ICharacterState

  // @ts-ignore
  public behaviour: ICharacterAI

  // Vehicles
  public controlledObject: IControllable | undefined
  public occupyingSeat: VehicleSeat | undefined
  public vehicleEntryInstance: VehicleEntryInstance | undefined

  private physicsEnabled = true
  private dracoLoader: DRACOLoader
  private gltfLoader: GLTFLoader

  constructor(gltf: any) {
    super()

    this.readCharacterData(gltf)
    this.setAnimations(gltf.animations)

    // The visuals group is centered for easy character tilting
    this.tiltContainer = new THREE.Group()
    this.add(this.tiltContainer)

    // Model container is used to reliably ground the character, as animation can alter the position of the model itself
    this.modelContainer = new THREE.Group()
    this.modelContainer.position.y = -0.57
    this.tiltContainer.add(this.modelContainer)
    this.modelContainer.add(gltf.scene)

    this.mixer = new THREE.AnimationMixer(gltf.scene)

    this.velocitySimulator = new VectorSpringSimulator(
      60,
      this.defaultVelocitySimulatorMass,
      this.defaultVelocitySimulatorDamping
    )
    this.rotationSimulator = new RelativeSpringSimulator(
      60,
      this.defaultRotationSimulatorMass,
      this.defaultRotationSimulatorDamping
    )

    this.viewVector = new THREE.Vector3()

    // Loader
    this.dracoLoader = new DRACOLoader()
    this.dracoLoader.setDecoderPath('/lib/draco/')
    this.gltfLoader = new GLTFLoader()
    this.gltfLoader.setDRACOLoader(this.dracoLoader)

    // Actions
    this.actions = {
      up: new KeyBinding('KeyW'),
      down: new KeyBinding('KeyS'),
      left: new KeyBinding('KeyA'),
      right: new KeyBinding('KeyD'),
      run: new KeyBinding('ShiftLeft'),
      jump: new KeyBinding('Space'),
      use: new KeyBinding('KeyE'),
      enter: new KeyBinding('KeyF'),
      enter_passenger: new KeyBinding('KeyG'),
      seat_switch: new KeyBinding('KeyX'),
      primary: new KeyBinding('Mouse0'),
      secondary: new KeyBinding('Mouse1')
    }

    // Physics
    // Player Capsule
    this.characterCapsule = new CapsuleCollider({
      mass: 1,
      position: new CANNON.Vec3(),
      height: 0.5,
      radius: 0.25,
      segments: 8,
      friction: 0.0
    })

    // capsulePhysics.physical.collisionFilterMask = ~CollisionGroups.Trimesh;
    // @ts-ignore
    this.characterCapsule.body.shapes.forEach(shape => {
      // tslint:disable-next-line: no-bitwise
      shape.collisionFilterMask = ~CollisionGroups.TrimeshColliders
    })
    this.characterCapsule.body.allowSleep = false

    // Move character to different collision group for raycasting
    this.characterCapsule.body.collisionFilterGroup = 2

    // Disable character rotation
    this.characterCapsule.body.fixedRotation = true
    this.characterCapsule.body.updateMassProperties()

    // Ray cast debug
    this.raycastBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.1, 0.1),
      new THREE.MeshLambertMaterial({
        color: 0xff0000
      })
    )
    this.raycastBox.visible = false
    this.raycastHoverBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.1, 0.1),
      new THREE.MeshLambertMaterial({
        color: 0x00ff00
      })
    )
    this.raycastHoverBox.visible = false

    // Physics pre/post step callback bindings
    this.characterCapsule.body.preStep = (body: CANNON.Body) => {
      this.physicsPreStep(body, this)
    }
    this.characterCapsule.body.postStep = (body: CANNON.Body) => {
      this.physicsPostStep(body, this)
    }

    // States
    this.setState(new Idle(this))
  }

  public setMetadata(metadata: ICharacterMetadata): void {
    this.metadata.displayName = metadata.displayName
    this.characterCapsule.body.displayName = metadata.displayName
    this.metadata.objectType = metadata.objectType
    this.characterCapsule.body.objectType = metadata.objectType

    if (!this.isPlayer && !this.characterLabel) {
      const labelDomElement = document.createElement('div')
      labelDomElement.className = 'verse-character-label-container'
      labelDomElement.textContent = metadata.displayName
      this.characterLabel = new CSS2DObject(labelDomElement)
      this.characterLabel.position.copy(new THREE.Vector3(0, 1.25, 0))
      this.modelContainer.add(this.characterLabel)
    }
  }

  public setLabelVisible(labelVisibility: boolean): void {
    if (this.characterLabel) {
      this.characterLabel.visible = labelVisibility
    }
  }

  public setAnimations(animations: any[]): void {
    this.animations = animations
  }

  public setArcadeVelocityInfluence(x: number, y: number = x, z: number = x): void {
    this.arcadeVelocityInfluence.set(x, y, z)
  }

  public setViewVector(vector: THREE.Vector3): void {
    this.viewVector.copy(vector).normalize()
  }

  /**
   * Set state to the player. Pass state class (function) name.
   * @param {function} State
   */
  public setState(state: ICharacterState): void {
    this.charState = state
    this.charState.onInputChange()
  }

  public setPosition(x: number, y: number, z: number): void {
    if (this.physicsEnabled) {
      this.characterCapsule.body.previousPosition = new CANNON.Vec3(x, y, z)
      this.characterCapsule.body.position = new CANNON.Vec3(x, y, z)
      this.characterCapsule.body.interpolatedPosition = new CANNON.Vec3(x, y, z)
    } else {
      this.position.x = x
      this.position.y = y
      this.position.z = z
    }
  }

  public resetVelocity(): void {
    this.velocity.x = 0
    this.velocity.y = 0
    this.velocity.z = 0

    this.characterCapsule.body.velocity.x = 0
    this.characterCapsule.body.velocity.y = 0
    this.characterCapsule.body.velocity.z = 0

    this.velocitySimulator.init()
  }

  public setArcadeVelocityTarget(velZ: number, velX = 0, velY = 0): void {
    this.velocityTarget.z = velZ
    this.velocityTarget.x = velX
    this.velocityTarget.y = velY
  }

  public setOrientation(vector: THREE.Vector3, instantly = false): void {
    const lookVector = new THREE.Vector3().copy(vector).setY(0).normalize()
    this.orientationTarget.copy(lookVector)

    if (instantly) {
      this.orientation.copy(lookVector)
    }
  }

  public resetOrientation(): void {
    const forward = Utils.getForward(this)
    this.setOrientation(forward, true)
  }

  public setBehaviour(behaviour: ICharacterAI): void {
    const scope = this
    behaviour.character = scope
    this.behaviour = behaviour
  }

  public setPhysicsEnabled(value: boolean): void {
    this.physicsEnabled = value

    if (value === true) {
      this.world?.physicsWorld.addBody(this.characterCapsule.body)
    } else {
      this.world?.physicsWorld.remove(this.characterCapsule.body)
    }
  }

  public readCharacterData(gltf: any): void {
    // @ts-ignore
    gltf.scene.traverse(child => {
      if (child.isMesh) {
        Utils.setupMeshProperties(child)

        if (child.material !== undefined) {
          this.materials.push(child.material)
        }
      }
    })
  }

  // NOTE
  public playAnimationClip(animationClip: string, isTriggerRoomEvent = false): void {
    if (this.world?.room && animationClip !== 'idle') {
      const animation = getAnimationDetails(animationClip)

      this.setAnimation(animation.clip, animation.fade)

      if (isTriggerRoomEvent) {
        this.world!.room!.send('animation', {
          clip: animation.clip
        })
      }

      setTimeout(() => {
        if (this.currentClip === animationClip) {
          this.setAnimation('idle', 0.1)
        }

        if (isTriggerRoomEvent) {
          this.world!.room!.send('animation', {
            clip: 'idle'
          })
        }
      }, animation.duration * 1000)
    }
  }

  // NOTE: performance optimization needed
  public changeAvatar(newAvatarModel: string, isTriggerRoomEvent = false) {
    this.gltfLoader.load(`/assets/glb/character/${newAvatarModel}.glb`, gltf => {
      this.materials = []
      this.tiltContainer.remove(this.modelContainer)

      this.readCharacterData(gltf)
      this.setAnimations(gltf.animations)

      this.modelContainer = new THREE.Group()
      this.modelContainer.position.y = -0.57
      this.tiltContainer.add(this.modelContainer)
      this.modelContainer.add(gltf.scene)

      this.mixer = new THREE.AnimationMixer(gltf.scene)

      this.setState(new Idle(this))

      // Shadow cascades
      this.materials.forEach(mat => {
        this.world!.sky.csm.setupMaterial(mat)
      })

      if (isTriggerRoomEvent) {
        if (this.world?.room) {
          this.world.room.send('metadata', {
            avatarModel: newAvatarModel
          })
        }
      }
    })
  }

  public handleKeyboardEvent(event: KeyboardEvent, code: string, pressed: boolean): void {
    if (this.world!.dialogMode) return
    if (this.controlledObject !== undefined) {
      this.controlledObject.handleKeyboardEvent(event, code, pressed)
    } else {
      // Free camera
      if (code === 'KeyC' && pressed === true && event.shiftKey === true) {
        const scope = this
        this.resetControls()
        this.world!.cameraOperator.characterCaller = scope
        this.world?.inputManager.setInputReceiver(this.world!.cameraOperator)
      } else if (code === 'KeyE' && pressed === true) {
        if (this.hoverObjectDisplayName) {
          SHOW_VIEW_DIALOG_BOX_ACTION()
        } else {
          HIDE_VIEW_DIALOG_BOX_ACTION()
        }
      } else if (code === 'KeyR' && pressed === true && event.shiftKey === true) {
        this.world?.restartScenario()
      } else {
        for (const action in this.actions) {
          if (this.actions.hasOwnProperty(action)) {
            const binding = this.actions[action]

            if (_.includes(binding.eventCodes, code)) {
              this.triggerAction(action, pressed)

              if (this.world?.room) {
                this.world.room.send('actions', {
                  action,
                  pressed
                })
              }
            }
          }
        }

        if (this.world?.room) {
          this.world.room.send('keyboard-event', {
            posX: this.characterCapsule.body.position.x,
            posY: this.characterCapsule.body.position.y,
            posZ: this.characterCapsule.body.position.z,
            oriX: this.orientation.x,
            oriY: this.orientation.y,
            oriZ: this.orientation.z,
            vecX: this.viewVector.x,
            vecY: this.viewVector.y,
            vecZ: this.viewVector.z
          })
        }
      }
    }
  }

  public handleMouseButton(event: MouseEvent, code: string, pressed: boolean): void {
    if (this.controlledObject !== undefined) {
      this.controlledObject.handleMouseButton(event, code, pressed)
    } else {
      for (const action in this.actions) {
        if (this.actions.hasOwnProperty(action)) {
          const binding = this.actions[action]

          if (_.includes(binding.eventCodes, code)) {
            this.triggerAction(action, pressed)
          }
        }
      }
    }
  }

  public handleMouseMove(event: MouseEvent, deltaX: number, deltaY: number): void {
    if (this.controlledObject !== undefined) {
      this.controlledObject.handleMouseMove(event, deltaX, deltaY)
    } else {
      this.world?.cameraOperator.move(deltaX, deltaY)
    }
  }

  public handleTouchMove(event: TouchEvent, deltaX: number, deltaY: number): void {
    if (this.controlledObject !== undefined) {
      this.controlledObject.handleTouchMove(event, deltaX, deltaY)
    } else {
      this.world?.cameraOperator.move(deltaX, deltaY)
    }
  }

  public handleMouseWheel(event: WheelEvent, value: number): void {
    if (this.world?.dialogMode) return
    if (this.controlledObject !== undefined) {
      this.controlledObject.handleMouseWheel(event, value)
    } else {
      // this.world.scrollTheTimeScale(value)
      this.zoomLevel += event.deltaY * 0.01
      this.zoomLevel = Math.min(Math.max(1.2, this.zoomLevel), 5)
      this.world?.cameraOperator.setRadius(this.zoomLevel, true)
    }
  }

  public triggerAction(actionName: string, value: boolean): void {
    // Get action and set it's parameters
    const action = this.actions[actionName]

    if (action.isPressed !== value) {
      // Set value
      action.isPressed = value

      // Reset the 'just' attributes
      action.justPressed = false
      action.justReleased = false

      // Set the 'just' attributes
      if (value) action.justPressed = true
      else action.justReleased = true

      // Tell player to handle states according to new input
      this.charState.onInputChange()

      // Reset the 'just' attributes
      action.justPressed = false
      action.justReleased = false
    }
  }

  public takeControl(): void {
    if (this.world !== undefined) {
      this.world.inputManager.setInputReceiver(this)
    } else {
      console.warn("Attempting to take control of a character that doesn't belong to a world.")
    }
  }

  public resetControls(): void {
    for (const action in this.actions) {
      if (this.actions.hasOwnProperty(action)) {
        this.triggerAction(action, false)
      }
    }
  }

  public update(timeStep: number): void {
    this.behaviour?.update(timeStep)
    this.vehicleEntryInstance?.update(timeStep)

    // console.log(this.occupyingSeat);
    this.charState?.update(timeStep)

    // this.visuals.position.copy(this.modelOffset);
    if (this.physicsEnabled) this.springMovement(timeStep)
    if (this.physicsEnabled) this.springRotation(timeStep)
    if (this.physicsEnabled) this.rotateModel()
    if (this.mixer !== undefined) this.mixer.update(timeStep)

    // Sync physics/graphics
    if (this.physicsEnabled) {
      this.position.set(
        this.characterCapsule.body.interpolatedPosition.x,
        this.characterCapsule.body.interpolatedPosition.y,
        this.characterCapsule.body.interpolatedPosition.z
      )
    } else {
      const newPos = new THREE.Vector3()
      this.getWorldPosition(newPos)

      this.characterCapsule.body.position.copy(Utils.cannonVector(newPos))
      this.characterCapsule.body.interpolatedPosition.copy(Utils.cannonVector(newPos))
    }

    this.updateMatrixWorld()
  }

  public inputReceiverInit(): void {
    if (this.controlledObject !== undefined) {
      this.controlledObject.inputReceiverInit()

      return
    }

    this.world?.cameraOperator.setRadius(5, true)
    this.world!.cameraOperator.followMode = false

    // this.world.dirLight.target = this;

    this.displayControls()
  }

  public displayControls(): void {
    this.world?.updateControls([
      {
        keys: ['W', 'A', 'S', 'D'],
        desc: 'Movement'
      },
      {
        keys: ['Shift'],
        desc: 'Sprint'
      },
      {
        keys: ['Space'],
        desc: 'Jump'
      },
      {
        keys: ['F', 'or', 'G'],
        desc: 'Enter vehicle'
      },
      {
        keys: ['Shift', '+', 'R'],
        desc: 'Respawn'
      },
      {
        keys: ['Shift', '+', 'C'],
        desc: 'Free camera'
      }
    ])
  }

  public inputReceiverUpdate(timeStep: number): void {
    if (this.controlledObject !== undefined) {
      this.controlledObject.inputReceiverUpdate(timeStep)
    } else {
      // Look in camera's direction
      this.viewVector = new THREE.Vector3().subVectors(this.position, this.world!.camera.position)
      this.getWorldPosition(this.world!.cameraOperator.target)
    }
  }

  public setAnimation(clipName: string, fadeIn: number): number | void {
    if (this.mixer !== undefined) {
      // gltf
      const clip = THREE.AnimationClip.findByName(this.animations, clipName)

      const action = this.mixer.clipAction(clip)
      if (action === null) {
        console.error(`Animation ${clipName} not found!`)

        return 0
      }

      this.currentClip = clipName
      this.mixer.stopAllAction()
      action.fadeIn(fadeIn)
      action.play()

      return action.getClip().duration
    }
  }

  public springMovement(timeStep: number): void {
    // Simulator
    this.velocitySimulator.target.copy(this.velocityTarget)
    this.velocitySimulator.simulate(timeStep)

    // Update values
    this.velocity.copy(this.velocitySimulator.position)
    this.acceleration.copy(this.velocitySimulator.velocity)
  }

  public springRotation(timeStep: number): void {
    // Spring rotation
    // Figure out angle between current and target orientation
    const angle = Utils.getSignedAngleBetweenVectors(this.orientation, this.orientationTarget)

    // Simulator
    this.rotationSimulator.target = angle
    this.rotationSimulator.simulate(timeStep)
    const rot = this.rotationSimulator.position

    // Updating values
    this.orientation.applyAxisAngle(new THREE.Vector3(0, 1, 0), rot)
    this.angularVelocity = this.rotationSimulator.velocity
  }

  public getLocalMovementDirection(): THREE.Vector3 {
    const positiveX = this.actions.right.isPressed ? -1 : 0
    const negativeX = this.actions.left.isPressed ? 1 : 0
    const positiveZ = this.actions.up.isPressed ? 1 : 0
    const negativeZ = this.actions.down.isPressed ? -1 : 0

    return new THREE.Vector3(positiveX + negativeX, 0, positiveZ + negativeZ).normalize()
  }

  public getCameraRelativeMovementVector(): THREE.Vector3 {
    const localDirection = this.getLocalMovementDirection()
    const flatViewVector = new THREE.Vector3(this.viewVector.x, 0, this.viewVector.z).normalize()

    return Utils.applyVectorMatrixXZ(flatViewVector, localDirection)
  }

  public setCameraRelativeOrientationTarget(): void {
    if (this.vehicleEntryInstance === undefined) {
      const moveVector = this.getCameraRelativeMovementVector()

      if (moveVector.x === 0 && moveVector.y === 0 && moveVector.z === 0) {
        this.setOrientation(this.orientation)
      } else {
        this.setOrientation(moveVector)
      }
    }
  }

  public rotateModel(): void {
    this.lookAt(
      this.position.x + this.orientation.x,
      this.position.y + this.orientation.y,
      this.position.z + this.orientation.z
    )
    this.tiltContainer.rotation.z = -this.angularVelocity * 2.3 * this.velocity.length()
    this.tiltContainer.position.setY(Math.cos(Math.abs(this.angularVelocity * 2.3 * this.velocity.length())) / 2 - 0.5)
  }

  public jump(initJumpSpeed = -1): void {
    this.wantsToJump = true
    this.initJumpSpeed = initJumpSpeed
  }

  public findVehicleToEnter(wantsToDrive: boolean): void {
    // reusable world position variable
    const worldPos = new THREE.Vector3()

    // Find best vehicle
    const vehicleFinder = new ClosestObjectFinder<Vehicle>(this.position, 10)
    this.world?.vehicles.forEach(vehicle => {
      vehicleFinder.consider(vehicle, vehicle.position)
    })

    if (vehicleFinder.closestObject !== undefined) {
      const vehicle = vehicleFinder.closestObject
      const vehicleEntryInstance = new VehicleEntryInstance(this)
      vehicleEntryInstance.wantsToDrive = wantsToDrive

      // Find best seat
      const seatFinder = new ClosestObjectFinder<VehicleSeat>(this.position)
      for (const seat of vehicle.seats) {
        if (wantsToDrive) {
          // Consider driver seats
          if (seat.type === SeatType.Driver) {
            seat.seatPointObject.getWorldPosition(worldPos)
            seatFinder.consider(seat, worldPos)
          }

          // Consider passenger seats connected to driver seats
          else if (seat.type === SeatType.Passenger) {
            for (const connSeat of seat.connectedSeats) {
              if (connSeat.type === SeatType.Driver) {
                seat.seatPointObject.getWorldPosition(worldPos)
                seatFinder.consider(seat, worldPos)
                break
              }
            }
          }
        } else {
          // Consider passenger seats
          if (seat.type === SeatType.Passenger) {
            seat.seatPointObject.getWorldPosition(worldPos)
            seatFinder.consider(seat, worldPos)
          }
        }
      }

      if (seatFinder.closestObject !== undefined) {
        const targetSeat = seatFinder.closestObject
        vehicleEntryInstance.targetSeat = targetSeat

        const entryPointFinder = new ClosestObjectFinder<THREE.Object3D>(this.position)

        for (const point of targetSeat.entryPoints) {
          point.getWorldPosition(worldPos)
          entryPointFinder.consider(point, worldPos)
        }

        if (entryPointFinder.closestObject !== undefined) {
          vehicleEntryInstance.entryPoint = entryPointFinder.closestObject
          this.triggerAction('up', true)
          this.vehicleEntryInstance = vehicleEntryInstance
        }
      }
    }
  }

  public enterVehicle(seat: VehicleSeat, entryPoint: THREE.Object3D): void {
    this.resetControls()

    if (seat.door?.rotation < 0.5) {
      this.setState(new OpenVehicleDoor(this, seat, entryPoint))
    } else {
      this.setState(new EnteringVehicle(this, seat, entryPoint))
    }
  }

  public teleportToVehicle(vehicle: Vehicle, seat: VehicleSeat): void {
    this.resetVelocity()
    this.rotateModel()
    this.setPhysicsEnabled(false)
    ;(vehicle as unknown as THREE.Object3D).attach(this)

    this.setPosition(
      seat.seatPointObject.position.x,
      seat.seatPointObject.position.y + 0.6,
      seat.seatPointObject.position.z
    )
    this.quaternion.copy(seat.seatPointObject.quaternion)

    this.occupySeat(seat)
    this.setState(new Driving(this, seat))

    this.startControllingVehicle(vehicle, seat)
  }

  // eslint-disable-next-line
  public startControllingVehicle(vehicle: IControllable, seat: VehicleSeat): void {
    if (this.controlledObject !== vehicle) {
      const scope = this
      this.transferControls(vehicle)
      this.resetControls()

      this.controlledObject = vehicle
      this.controlledObject.allowSleep(false)
      vehicle.inputReceiverInit()

      vehicle.controllingCharacter = scope
    }
  }

  public transferControls(entity: IControllable): void {
    // Currently running through all actions of this character and the vehicle,
    // comparing keycodes of actions and based on that triggering vehicle's actions
    // Maybe we should ask input manager what's the current state of the keyboard
    // and read those values... TODO
    for (const action1 in this.actions) {
      if (this.actions.hasOwnProperty(action1)) {
        for (const action2 in entity.actions) {
          if (entity.actions.hasOwnProperty(action2)) {
            const a1 = this.actions[action1]
            const a2 = entity.actions[action2]

            a1.eventCodes.forEach(code1 => {
              a2.eventCodes.forEach(code2 => {
                if (code1 === code2) {
                  entity.triggerAction(action2, a1.isPressed)
                }
              })
            })
          }
        }
      }
    }
  }

  public stopControllingVehicle(): void {
    if (this.controlledObject?.controllingCharacter === this) {
      this.controlledObject.allowSleep(true)
      this.controlledObject.controllingCharacter = undefined
      this.controlledObject.resetControls()
      this.controlledObject = undefined
      this.inputReceiverInit()
    }
  }

  public exitVehicle(): void {
    if (this.occupyingSeat !== undefined) {
      if (this.occupyingSeat.vehicle.entityType === EntityType.Airplane) {
        this.setState(new ExitingAirplane(this, this.occupyingSeat))
      } else {
        this.setState(new ExitingVehicle(this, this.occupyingSeat))
      }

      this.stopControllingVehicle()
    }
  }

  public occupySeat(seat: VehicleSeat): void {
    const scope = this
    this.occupyingSeat = seat
    seat.occupiedBy = scope
  }

  public leaveSeat(): void {
    if (this.occupyingSeat !== undefined) {
      this.occupyingSeat.occupiedBy = undefined
      this.occupyingSeat = undefined
    }
  }

  public physicsPreStep(body: CANNON.Body, character: Character): void {
    character.feetRaycast()

    // Raycast debug
    if (character.rayHasHit) {
      if (character.raycastBox.visible) {
        character.raycastBox.position.x = character.rayResult.hitPointWorld.x
        character.raycastBox.position.y = character.rayResult.hitPointWorld.y
        character.raycastBox.position.z = character.rayResult.hitPointWorld.z
      }
    } else {
      if (character.raycastBox.visible) {
        character.raycastBox.position.set(
          body.position.x,
          body.position.y - character.rayCastLength - character.raySafeOffset,
          body.position.z
        )
      }
    }
  }

  public feetRaycast(): void {
    // Player ray casting
    // Create ray
    const body = this.characterCapsule.body
    const start = new CANNON.Vec3(body.position.x, body.position.y, body.position.z)
    const end = new CANNON.Vec3(
      body.position.x,
      body.position.y - this.rayCastLength - this.raySafeOffset,
      body.position.z
    )

    // Raycast options
    const rayCastOptions = {
      collisionFilterMask: CollisionGroups.Default,
      skipBackfaces: true /* ignore back faces */
    }

    // Cast the ray
    this.rayHasHit = this.world!.physicsWorld.raycastClosest(start, end, rayCastOptions, this.rayResult)
  }

  public feetHoverRaycast(): void {
    // Player ray casting
    // Create ray
    const bodyPos = this.characterCapsule.body.position.clone()

    const unit = this.viewVector.normalize()

    const start = new CANNON.Vec3(bodyPos.x + 0.3 * unit.x, bodyPos.y + 0.3 * unit.y + 0.6, bodyPos.z + 0.3 * unit.z)
    const end = new CANNON.Vec3(bodyPos.x + 4 * unit.x, bodyPos.y + 4 * unit.y + 1.75, bodyPos.z + 4 * unit.z)

    // const material = new THREE.LineBasicMaterial({ color: 0x0000ff })
    // const geometry = new THREE.BufferGeometry().setFromPoints([start, end])
    // const line = new THREE.Line(geometry, material)
    // this.world.graphicsWorld.add(line)

    this.world!.cursorBox.position.copy(end)

    // Raycast options
    const rayCastOptions = {
      // collisionFilterMask: CollisionGroups.Default,
      skipBackfaces: true /* ignore back faces */
    }

    // Cast the ray
    this.rayHoverHasHit = this.world!.physicsWorld.raycastClosest(start, end, rayCastOptions, this.rayHoverResult)
  }

  public physicsPostStep(body: CANNON.Body, character: Character): void {
    if (this.isPlayer) {
      this.feetHoverRaycast()
    }

    // Get velocities
    const simulatedVelocity = new THREE.Vector3(body.velocity.x, body.velocity.y, body.velocity.z)

    // Take local velocity
    let arcadeVelocity = new THREE.Vector3().copy(character.velocity).multiplyScalar(character.moveSpeed)

    // Turn local into global
    arcadeVelocity = Utils.applyVectorMatrixXZ(character.orientation, arcadeVelocity)

    let newVelocity = new THREE.Vector3()

    // Additive velocity mode
    if (character.arcadeVelocityIsAdditive) {
      newVelocity.copy(simulatedVelocity)

      const globalVelocityTarget = Utils.applyVectorMatrixXZ(character.orientation, character.velocityTarget)
      const add = new THREE.Vector3().copy(arcadeVelocity).multiply(character.arcadeVelocityInfluence)

      if (
        Math.abs(simulatedVelocity.x) < Math.abs(globalVelocityTarget.x * character.moveSpeed) ||
        Utils.haveDifferentSigns(simulatedVelocity.x, arcadeVelocity.x)
      ) {
        newVelocity.x += add.x
      }
      if (
        Math.abs(simulatedVelocity.y) < Math.abs(globalVelocityTarget.y * character.moveSpeed) ||
        Utils.haveDifferentSigns(simulatedVelocity.y, arcadeVelocity.y)
      ) {
        newVelocity.y += add.y
      }
      if (
        Math.abs(simulatedVelocity.z) < Math.abs(globalVelocityTarget.z * character.moveSpeed) ||
        Utils.haveDifferentSigns(simulatedVelocity.z, arcadeVelocity.z)
      ) {
        newVelocity.z += add.z
      }
    } else {
      newVelocity = new THREE.Vector3(
        THREE.MathUtils.lerp(simulatedVelocity.x, arcadeVelocity.x, character.arcadeVelocityInfluence.x),
        THREE.MathUtils.lerp(simulatedVelocity.y, arcadeVelocity.y, character.arcadeVelocityInfluence.y),
        THREE.MathUtils.lerp(simulatedVelocity.z, arcadeVelocity.z, character.arcadeVelocityInfluence.z)
      )
    }

    // If we're hitting the ground, stick to ground
    if (character.rayHasHit) {
      // Flatten velocity
      newVelocity.y = 0

      // Move on top of moving objects
      if (character.rayResult.body.mass > 0) {
        const pointVelocity = new CANNON.Vec3()
        character.rayResult.body.getVelocityAtWorldPoint(character.rayResult.hitPointWorld, pointVelocity)
        newVelocity.add(Utils.threeVector(pointVelocity))
      }

      // Measure the normal vector offset from direct "up" vector
      // and transform it into a matrix
      const up = new THREE.Vector3(0, 1, 0)
      const normal = new THREE.Vector3(
        character.rayResult.hitNormalWorld.x,
        character.rayResult.hitNormalWorld.y,
        character.rayResult.hitNormalWorld.z
      )
      const q = new THREE.Quaternion().setFromUnitVectors(up, normal)
      const m = new THREE.Matrix4().makeRotationFromQuaternion(q)

      // Rotate the velocity vector
      newVelocity.applyMatrix4(m)

      // Compensate for gravity
      // newVelocity.y -= body.world.physicsWorld.gravity.y / body.character.world.physicsFrameRate;

      // Apply velocity
      body.velocity.x = newVelocity.x
      body.velocity.y = newVelocity.y
      body.velocity.z = newVelocity.z

      // Ground character
      body.position.y =
        character.rayResult.hitPointWorld.y +
        character.rayCastLength +
        newVelocity.y / character!.world!.physicsFrameRate
    } else {
      // If we're in air
      body.velocity.x = newVelocity.x
      body.velocity.y = newVelocity.y
      body.velocity.z = newVelocity.z

      // Save last in-air information
      character.groundImpactData.velocity.x = body.velocity.x
      character.groundImpactData.velocity.y = body.velocity.y
      character.groundImpactData.velocity.z = body.velocity.z
    }

    // If we're hover the item
    if (character.rayHoverHasHit) {
      // Do hover stuff
      this.world!.cursorBox.position.copy(character.rayHoverResult.hitPointWorld)
      if (character.rayHoverResult.body?.displayName && character.rayHoverResult.body?.objectType) {
        this.world!.setCursorBoxHover(true)
        character.hoverObjectDisplayName = character.rayHoverResult.body.displayName
        character.hoverObjectType = character.rayHoverResult.body.objectType
      } else {
        this.world!.setCursorBoxHover(false)
        character.hoverObjectDisplayName = undefined
        character.hoverObjectType = undefined
      }
      character.raycastHoverBox.position.y = character.rayHoverResult.hitPointWorld.y
      character.raycastHoverBox.position.z = character.rayHoverResult.hitPointWorld.z
      character.raycastHoverBox.position.x = character.rayHoverResult.hitPointWorld.x
    } else {
      this.world!.setCursorBoxHover(false)
      character.hoverObjectDisplayName = undefined
      character.hoverObjectType = undefined
    }

    if (character.isPlayer) {
      if (character.hoverObjectDisplayName && character.hoverObjectType) {
        SET_VIEW_DIALOG_BOX_ACTION({
          displayName: character.rayHoverResult.body.displayName,
          objectType: character.rayHoverResult.body.objectType
        })
      } else {
        UN_HOVER_VIEW_DIALOG_BOX_ACTION()
      }
    }

    // Jumping
    if (character.wantsToJump) {
      // If initJumpSpeed is set
      if (character.initJumpSpeed > -1) {
        // Flatten velocity
        body.velocity.y = 0
        const speed = Math.max(character.velocitySimulator.position.length() * 4, character.initJumpSpeed)
        body.velocity = Utils.cannonVector(character.orientation.clone().multiplyScalar(speed))
      } else {
        // Moving objects compensation
        const add = new CANNON.Vec3()
        character.rayResult.body.getVelocityAtWorldPoint(character.rayResult.hitPointWorld, add)
        body.velocity.vsub(add, body.velocity)
      }

      // Add positive vertical velocity
      body.velocity.y += 4

      // Move above ground by 2x safe offset value
      body.position.y += character.raySafeOffset * 2

      // Reset flag
      character.wantsToJump = false
    }
  }

  public addToWorld(world: World): void {
    if (_.includes(world.characters, this)) {
      console.warn('Adding character to a world in which it already exists.')
    } else {
      // Set world
      this.world = world

      // Register character
      if (this.metadata.objectType !== 'player') {
        world.characters.push(this)
      }

      // Register physics
      world.physicsWorld.addBody(this.characterCapsule.body)

      // Add to graphicsWorld
      world.graphicsWorld.add(this)
      world.graphicsWorld.add(this.raycastBox)
      world.graphicsWorld.add(this.raycastHoverBox)

      // Shadow cascades
      this.materials.forEach(mat => {
        world.sky.csm.setupMaterial(mat)
      })
    }
  }

  public removeFromWorld(world: World): void {
    if (!_.includes(world.characters, this) && !_.includes(world.visitors, this)) {
      console.warn("Removing character from a world in which it isn't present.")
    } else {
      if (world.inputManager.inputReceiver === this) {
        world.inputManager.inputReceiver = undefined
      }

      this.world = undefined

      // Remove from characters
      _.pull(world.characters, this)

      // Remove physics
      world.physicsWorld.remove(this.characterCapsule.body)

      // Remove visuals
      world.graphicsWorld.remove(this)
      world.graphicsWorld.remove(this.raycastBox)
      world.graphicsWorld.remove(this.raycastHoverBox)
    }
  }
}
