import { CharacterStateBase, JumpIdle, Walk } from 'src/views/verse/book/characters/view/character_states/_stateLibrary'
import { ICharacterState } from 'src/views/verse/book/interfaces/ICharacterState'
import { Character } from 'src/views/verse/book/characters/view/Character'

export class Idle extends CharacterStateBase implements ICharacterState {
  constructor(character: Character) {
    super(character)

    this.character.velocitySimulator.damping = 0.6
    this.character.velocitySimulator.mass = 10

    this.character.setArcadeVelocityTarget(0)
    this.playAnimation('idle', 0.1)

    this.character.audioManager.adjustRate('walk', 3)
    this.character.audioManager.stop('walk')
  }

  public update(timeStep: number): void {
    super.update(timeStep)

    this.fallInAir()
  }
  public onInputChange(): void {
    super.onInputChange()

    if (this.character.actions.jump.justPressed) {
      this.character.setState(new JumpIdle(this.character))
    }

    if (this.anyDirection()) {
      if (this.character.velocity.length() > 0.5) {
        this.character.setState(new Walk(this.character))
      } else {
        this.setAppropriateStartWalkState()
      }
    }
  }
}
