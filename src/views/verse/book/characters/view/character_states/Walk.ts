import {
  CharacterStateBase,
  EndWalk,
  Idle,
  JumpRunning,
  Sprint
} from 'src/views/verse/book/characters/view/character_states/_stateLibrary'
import { Character } from 'src/views/verse/book/characters/view/Character'

export class Walk extends CharacterStateBase {
  constructor(character: Character) {
    super(character)

    this.canEnterVehicles = true
    this.character.setArcadeVelocityTarget(0.8)
    this.playAnimation('run', 0.1)

    this.character.audioManager.play('walk')
  }

  public update(timeStep: number): void {
    super.update(timeStep)

    this.character.setCameraRelativeOrientationTarget()

    this.fallInAir()
  }

  public onInputChange(): void {
    super.onInputChange()

    // if (this.noDirection()) {
    //   this.character.setState(new EndWalk(this.character))
    // }

    if (this.character.actions.run.isPressed) {
      this.character.audioManager.stop('walk')
      this.character.audioManager.adjustRate('walk', 4.5)
      this.character.audioManager.play('walk')
      this.character.setState(new Sprint(this.character))
    } else {
      this.character.audioManager.stop('walk')
      this.character.audioManager.adjustRate('walk', 3)
      this.character.audioManager.play('walk')
    }

    if (this.character.actions.run.justPressed) {
      this.character.setState(new Sprint(this.character))
    }

    if (this.character.actions.jump.justPressed) {
      this.character.setState(new JumpRunning(this.character))
    }

    if (this.noDirection()) {
      if (this.character.velocity.length() > 1) {
        this.character.setState(new EndWalk(this.character))
      } else {
        this.character.setState(new Idle(this.character))
      }
    }
  }
}
