import {
  CharacterStateBase,
  Idle,
  JumpIdle,
  Sprint,
  Walk
} from 'src/views/verse/book/characters/view/character_states/_stateLibrary'
import { ICharacterState } from 'src/views/verse/book/interfaces/ICharacterState'
import { Character } from 'src/views/verse/book/characters/view/Character'

export class EndWalk extends CharacterStateBase implements ICharacterState {
  constructor(character: Character) {
    super(character)

    this.character.setArcadeVelocityTarget(0)
    this.animationLength = character.setAnimation('stop', 0.1)
  }

  public update(timeStep: number): void {
    super.update(timeStep)

    if (this.animationEnded(timeStep)) {
      this.character.setState(new Idle(this.character))
    }

    this.fallInAir()
  }

  public onInputChange(): void {
    super.onInputChange()

    if (this.character.actions.jump.justPressed) {
      this.character.setState(new JumpIdle(this.character))
    }

    if (this.anyDirection()) {
      if (this.character.actions.run.isPressed) {
        this.character.setState(new Sprint(this.character))
      } else {
        if (this.character.velocity.length() > 0.5) {
          this.character.setState(new Walk(this.character))
        } else {
          this.setAppropriateStartWalkState()
        }
      }
    }
  }
}
