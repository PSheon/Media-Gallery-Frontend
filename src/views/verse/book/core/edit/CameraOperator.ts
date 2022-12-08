import * as THREE from 'three'

// @ts-ignore
import * as CANNON from 'src/views/verse/lib/cannon/cannon'
import * as Utils from 'src/views/verse/book/core/FunctionLibrary'
import { World } from 'src/views/verse/book/world/EditWorld'
import { IInputReceiver } from 'src/views/verse/book/interfaces/IInputReceiver'
import { KeyBinding } from 'src/views/verse/book/core/KeyBinding'
import { IUpdatable } from 'src/views/verse/book/interfaces/IUpdatable'
import _ from 'lodash'

import {
  SET_EDIT_DIALOG_BOX_ACTION,
  UN_HOVER_EDIT_DIALOG_BOX_ACTION,
  SHOW_EDIT_DIALOG_BOX_ACTION,
  HIDE_EDIT_DIALOG_BOX_ACTION
} from 'src/views/verse/book/actions/edit'

export class CameraOperator implements IInputReceiver, IUpdatable {
  public updateOrder = 4

  public world: World
  public camera: THREE.Camera
  public target: THREE.Vector3
  public sensitivity: THREE.Vector2
  public radius = 1
  public theta: number
  public phi: number
  public onMouseDownPosition: THREE.Vector2
  public onMouseDownTheta: any
  public onMouseDownPhi: any
  public targetRadius = 1

  public rayHasHit = false
  public rayResult = new CANNON.RaycastResult()
  public hoverObjectMetadata:
    | {
        displayName: string | undefined
        position?: string
      }
    | undefined
  public hoverObjectType: string | undefined
  public movementSpeed: number
  public actions: { [action: string]: KeyBinding }

  public upVelocity = 0
  public forwardVelocity = 0
  public rightVelocity = 0

  public followMode = false

  constructor(world: World, camera: THREE.Camera, sensitivityX = 1, sensitivityY: number = sensitivityX * 0.8) {
    this.world = world
    this.camera = camera
    this.target = new THREE.Vector3()
    this.sensitivity = new THREE.Vector2(sensitivityX, sensitivityY)

    this.movementSpeed = 0.06
    this.radius = 5
    this.theta = 0
    this.phi = 0

    this.onMouseDownPosition = new THREE.Vector2()
    this.onMouseDownTheta = this.theta
    this.onMouseDownPhi = this.phi

    this.actions = {
      forward: new KeyBinding('KeyW'),
      back: new KeyBinding('KeyS'),
      left: new KeyBinding('KeyA'),
      right: new KeyBinding('KeyD'),
      up: new KeyBinding('KeyQ'),
      down: new KeyBinding('KeyZ'),
      fast: new KeyBinding('ShiftLeft')
    }

    world.registerUpdatable(this)
  }

  public setSensitivity(sensitivityX: number, sensitivityY: number = sensitivityX): void {
    this.sensitivity = new THREE.Vector2(sensitivityX, sensitivityY)
  }

  public setRadius(value: number, instantly = false): void {
    this.targetRadius = Math.max(0.001, value)
    if (instantly === true) {
      this.radius = value
    }
  }

  public move(deltaX: number, deltaY: number): void {
    this.theta -= deltaX * (this.sensitivity.x / 2)
    this.theta %= 360
    this.phi += deltaY * (this.sensitivity.y / 2)
    this.phi = Math.min(85, Math.max(-85, this.phi))
  }

  // eslint-disable-next-line
  public update(timeScale: number): void {
    if (this.followMode === true) {
      this.camera.position.y = THREE.MathUtils.clamp(this.camera.position.y, this.target.y, Number.POSITIVE_INFINITY)
      this.camera.lookAt(this.target)
      const newPos = this.target
        .clone()
        .add(
          new THREE.Vector3()
            .subVectors(this.camera.position, this.target)
            .normalize()
            .multiplyScalar(this.targetRadius)
        )
      this.camera.position.x = newPos.x
      this.camera.position.y = newPos.y
      this.camera.position.z = newPos.z
    } else {
      this.radius = THREE.MathUtils.lerp(this.radius, this.targetRadius, 0.1)

      this.camera.position.x =
        this.target.x + this.radius * Math.sin((this.theta * Math.PI) / 180) * Math.cos((this.phi * Math.PI) / 180)
      this.camera.position.y = this.target.y + this.radius * Math.sin((this.phi * Math.PI) / 180)
      this.camera.position.z =
        this.target.z + this.radius * Math.cos((this.theta * Math.PI) / 180) * Math.cos((this.phi * Math.PI) / 180)
      this.camera.updateMatrix()
      this.camera.lookAt(this.target)

      const camPos = this.world.camera.position.clone()
      const camDir = this.world.camera.getWorldDirection(new THREE.Vector3()).normalize()

      const start = new CANNON.Vec3(camPos.x, camPos.y, camPos.z)
      const end = new CANNON.Vec3(camPos.x + 4 * camDir.x, camPos.y + 4 * camDir.y, camPos.z + 4 * camDir.z)

      this.world.cursorBox.position.copy(end)

      // const material = new THREE.LineBasicMaterial({ color: 0x0000ff })
      // const geometry = new THREE.BufferGeometry().setFromPoints([start, end])
      // const line = new THREE.Line(geometry, material)
      // this.world.graphicsWorld.add(line)

      // Raycast options
      const rayCastOptions = {
        // collisionFilterMask: CollisionGroups.Default,

        /* ignore back faces */
        skipBackfaces: true
      }

      // Cast the ray
      this.rayHasHit = this.world.physicsWorld.raycastClosest(start, end, rayCastOptions, this.rayResult)

      if (this.rayHasHit) {
        this.world.cursorBox.position.copy(this.rayResult.hitPointWorld)
        if (this.rayResult.body?.objectType) {
          this.world.setCursorBoxHover(true)
          this.hoverObjectMetadata = this.rayResult.body.objectMetadata
          this.hoverObjectType = this.rayResult.body.objectType
        } else {
          this.world.setCursorBoxHover(false)
          delete this.hoverObjectMetadata
          delete this.hoverObjectType
        }
      } else {
        this.world.setCursorBoxHover(false)
        delete this.hoverObjectMetadata
        delete this.hoverObjectType
      }

      if (this.hoverObjectType) {
        SET_EDIT_DIALOG_BOX_ACTION({
          hoverObjectType: this.hoverObjectType,
          hoverObjectMetadata: this.hoverObjectMetadata!
        })
      } else {
        UN_HOVER_EDIT_DIALOG_BOX_ACTION()
      }
    }
  }

  public handleKeyboardEvent(event: KeyboardEvent, code: string, pressed: boolean): void {
    // Free camera
    if (this.world.dialogMode) return
    if (code === 'KeyE' && pressed === true) {
      if (this.hoverObjectType) {
        this.world?.setDialogMode(true)
        SHOW_EDIT_DIALOG_BOX_ACTION()
      } else {
        this.world?.setDialogMode(false)
        HIDE_EDIT_DIALOG_BOX_ACTION()
      }
    } else {
      for (const action in this.actions) {
        if (this.actions.hasOwnProperty(action)) {
          const binding = this.actions[action]

          if (_.includes(binding.eventCodes, code)) {
            binding.isPressed = pressed
          }
        }
      }
    }
  }

  // eslint-disable-next-line
  public handleMouseWheel(event: WheelEvent, value: number): void {
    // this.world.scrollTheTimeScale(value)
  }

  public handleMouseButton(event: MouseEvent, code: string, pressed: boolean): void {
    for (const action in this.actions) {
      if (this.actions.hasOwnProperty(action)) {
        const binding = this.actions[action]

        if (_.includes(binding.eventCodes, code)) {
          binding.isPressed = pressed
        }
      }
    }
  }

  public handleMouseMove(event: MouseEvent, deltaX: number, deltaY: number): void {
    this.move(deltaX, deltaY)
  }

  public handleTouchMove(event: TouchEvent, deltaX: number, deltaY: number): void {
    this.move(deltaX, deltaY)
  }

  public inputReceiverInit(): void {
    this.target.copy(this.camera.position)
    this.setRadius(0, true)

    // this.world.dirLight.target = this.world.camera;

    this.world.updateControls([
      {
        keys: ['W', 'S', 'A', 'D'],
        desc: 'Move around'
      },
      {
        keys: ['Q', 'Z'],
        desc: 'Move up / down'
      },
      {
        keys: ['E'],
        desc: 'Edit frame'
      },
      {
        keys: ['Shift'],
        desc: 'Speed up'
      },
      {
        keys: ['Shift', '+', 'C'],
        desc: 'Exit free camera mode'
      }
    ])
  }

  public inputReceiverUpdate(timeStep: number): void {
    // Set fly speed
    const speed = this.movementSpeed * (this.actions.fast.isPressed ? timeStep * 600 : timeStep * 60)

    const up = Utils.getUp(this.camera)
    const right = Utils.getRight(this.camera)
    const forward = Utils.getBack(this.camera)

    this.upVelocity = THREE.MathUtils.lerp(
      this.upVelocity,
      +this.actions.up.isPressed - +this.actions.down.isPressed,
      0.3
    )
    this.forwardVelocity = THREE.MathUtils.lerp(
      this.forwardVelocity,
      +this.actions.forward.isPressed - +this.actions.back.isPressed,
      0.3
    )
    this.rightVelocity = THREE.MathUtils.lerp(
      this.rightVelocity,
      +this.actions.right.isPressed - +this.actions.left.isPressed,
      0.3
    )

    this.target.add(up.multiplyScalar(speed * this.upVelocity))
    this.target.add(forward.multiplyScalar(speed * this.forwardVelocity))
    this.target.add(right.multiplyScalar(speed * this.rightVelocity))
  }
}
