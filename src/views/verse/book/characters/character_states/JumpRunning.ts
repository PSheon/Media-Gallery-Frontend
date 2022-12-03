import { CharacterStateBase, Falling } from 'src/views/verse/book/characters/character_states/_stateLibrary'
import { ICharacterState } from 'src/views/verse/book/interfaces/ICharacterState'
import { Character } from 'src/views/verse/book/characters/view/Character'

export class JumpRunning extends CharacterStateBase implements ICharacterState {
  private alreadyJumped: boolean

  constructor(character: Character) {
    super(character)

    this.character.velocitySimulator.mass = 100
    this.playAnimation('jump_running', 0.03)
    this.alreadyJumped = false
  }

  public update(timeStep: number): void {
    super.update(timeStep)

    this.character.setCameraRelativeOrientationTarget()

    // Move in air
    if (this.alreadyJumped) {
      this.character.setArcadeVelocityTarget(this.anyDirection() ? 0.8 : 0)
    }

    // Physically jump
    if (this.timer > 0.13 && !this.alreadyJumped) {
      this.character.jump(4)
      this.alreadyJumped = true

      this.character.rotationSimulator.damping = 0.3
      this.character.arcadeVelocityIsAdditive = true
      this.character.setArcadeVelocityInfluence(0.05, 0, 0.05)
    } else if (this.timer > 0.24 && this.character.rayHasHit) {
      this.setAppropriateDropState()
    } else if (this.animationEnded(timeStep)) {
      this.character.setState(new Falling(this.character))
    }
  }
}
