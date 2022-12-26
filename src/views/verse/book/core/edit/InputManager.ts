import { World } from 'src/views/verse/book/world/EditWorld'
import { IInputReceiver } from 'src/views/verse/book/interfaces/IInputReceiver'
import { IUpdatable } from 'src/views/verse/book/interfaces/IUpdatable'

export class InputManager implements IUpdatable {
  public updateOrder = 3

  public world: World
  public domElement: any
  public pointerLock: any
  public isLocked: boolean
  public inputReceiver: IInputReceiver | undefined

  public boundOnMouseDown: (evt: any) => void
  public boundOnMouseMove: (evt: any) => void
  public boundOnMouseUp: (evt: any) => void
  public boundOnTouchStart: (evt: any) => void
  public boundOnTouchMove: (evt: any) => void
  public boundOnTouchEnd: (evt: any) => void
  public boundOnMouseWheelMove: (evt: any) => void
  public boundOnPointerlockChange: (evt: any) => void
  public boundOnPointerlockError: (evt: any) => void
  public boundOnKeyDown: (evt: any) => void
  public boundOnKeyUp: (evt: any) => void

  private _position: { x: number; y: number }
  private _delta: { x: number; y: number }

  constructor(world: World, domElement: HTMLElement) {
    this.world = world
    this.pointerLock = world.params.Pointer_Lock
    this.domElement = domElement || document.body
    this.isLocked = false

    this._position = { x: 0, y: 0 }
    this._delta = { x: 0, y: 0 }

    // Bindings for later event use
    // Mouse
    this.boundOnMouseDown = evt => this.onMouseDown(evt)
    this.boundOnMouseMove = evt => this.onMouseMove(evt)
    this.boundOnMouseUp = evt => this.onMouseUp(evt)
    this.boundOnMouseWheelMove = evt => this.onMouseWheelMove(evt)

    // Touch
    this.boundOnTouchStart = evt => this.onTouchStart(evt)
    this.boundOnTouchMove = evt => this.onTouchMove(evt)
    this.boundOnTouchEnd = evt => this.onTouchEnd(evt)

    // Pointer lock
    this.boundOnPointerlockChange = evt => this.onPointerlockChange(evt)
    this.boundOnPointerlockError = evt => this.onPointerlockError(evt)

    // Keys
    this.boundOnKeyDown = evt => this.onKeyDown(evt)
    this.boundOnKeyUp = evt => this.onKeyUp(evt)

    // Init event listeners
    if (window.innerWidth > 768) {
      // Mouse
      this.domElement.addEventListener('mousedown', this.boundOnMouseDown, false)
    } else {
      // Touch
      this.domElement.addEventListener('touchstart', this.boundOnTouchStart, false)
    }

    // Mouse
    document.addEventListener('wheel', this.boundOnMouseWheelMove, false)
    document.addEventListener('pointerlockchange', this.boundOnPointerlockChange, false)
    document.addEventListener('pointerlockerror', this.boundOnPointerlockError, false)

    // Keys
    document.addEventListener('keydown', this.boundOnKeyDown, false)
    document.addEventListener('keyup', this.boundOnKeyUp, false)

    world.registerUpdatable(this)
  }

  public update(timeStep: number, unscaledTimeStep: number): void {
    if (this.inputReceiver === undefined && this.world !== undefined && this.world.cameraOperator !== undefined) {
      this.setInputReceiver(this.world.cameraOperator)
    }

    this.inputReceiver?.inputReceiverUpdate(unscaledTimeStep)
  }

  public setInputReceiver(receiver: IInputReceiver): void {
    this.inputReceiver = receiver
    this.inputReceiver.inputReceiverInit()
  }

  public setPointerLock(enabled: boolean): void {
    this.pointerLock = enabled
  }

  // eslint-disable-next-line
  public onPointerlockChange(event: MouseEvent): void {
    if (document.pointerLockElement === this.domElement) {
      this.domElement.addEventListener('mousemove', this.boundOnMouseMove, false)
      this.domElement.addEventListener('mouseup', this.boundOnMouseUp, false)
      this.isLocked = true
    } else {
      this.domElement.removeEventListener('mousemove', this.boundOnMouseMove, false)
      this.domElement.removeEventListener('mouseup', this.boundOnMouseUp, false)
      this.isLocked = false
    }
  }

  // eslint-disable-next-line
  public onPointerlockError(event: MouseEvent): void {
    console.error('PointerLockControls: Unable to use Pointer Lock API')
  }

  public onMouseDown(event: MouseEvent): void {
    if (this.pointerLock) {
      this.domElement.requestPointerLock()
    } else {
      this.domElement.addEventListener('mousemove', this.boundOnMouseMove, false)
      this.domElement.addEventListener('mouseup', this.boundOnMouseUp, false)
    }

    if (this.inputReceiver !== undefined) {
      this.inputReceiver.handleMouseButton(event, 'mouse' + event.button, true)
    }
  }

  public onMouseMove(event: MouseEvent): void {
    if (this.inputReceiver !== undefined) {
      this.inputReceiver.handleMouseMove(event, event.movementX, event.movementY)
    }
  }

  public onMouseUp(event: MouseEvent): void {
    if (!this.pointerLock) {
      this.domElement.removeEventListener('mousemove', this.boundOnMouseMove, false)
      this.domElement.removeEventListener('mouseup', this.boundOnMouseUp, false)
    }

    if (this.inputReceiver !== undefined) {
      this.inputReceiver.handleMouseButton(event, 'mouse' + event.button, false)
    }
  }

  // eslint-disable-next-line
  public onTouchStart(event: TouchEvent) {
    this.domElement.addEventListener('touchmove', this.boundOnTouchMove, false)
    this.domElement.addEventListener('touchend', this.boundOnTouchEnd, false)
  }

  public onTouchMove(event: TouchEvent) {
    let hasDrag = false
    const flag = Math.min(event.touches.length, 2)
    for (let i = 0; i < flag; i++) {
      if (hasDrag) continue
      if ((event.touches[i].target as HTMLElement).tagName === 'CANVAS') {
        hasDrag = true
        const { clientX } = event.touches[i]
        const { clientY } = event.touches[i]
        this._delta = { x: clientX - this._position.x, y: clientY - this._position.y }
        this._position = { x: clientX, y: clientY }
      }
    }

    if (this.inputReceiver !== undefined) {
      if (Math.abs(this._delta.x) < 50 && Math.abs(this._delta.y) < 50) {
        this.inputReceiver.handleTouchMove(event, -this._delta.x, this._delta.y)
      }
    }
  }

  // eslint-disable-next-line
  public onTouchEnd(event: TouchEvent) {
    this.domElement.removeEventListener('touchmove', this.boundOnTouchMove, false)
    this.domElement.removeEventListener('touchend', this.boundOnTouchEnd, false)

    this._delta = { x: 0, y: 0 }
    this._position = { x: 0, y: 0 }
  }

  public onKeyDown(event: KeyboardEvent): void {
    if (this.inputReceiver !== undefined) {
      this.inputReceiver.handleKeyboardEvent(event, event.code, true)
    }
  }

  public onKeyUp(event: KeyboardEvent): void {
    if (this.inputReceiver !== undefined) {
      this.inputReceiver.handleKeyboardEvent(event, event.code, false)
    }
  }

  public onMouseWheelMove(event: WheelEvent): void {
    if (this.inputReceiver !== undefined) {
      this.inputReceiver.handleMouseWheel(event, event.deltaY)
    }
  }
}
