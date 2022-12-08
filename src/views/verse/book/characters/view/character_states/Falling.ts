import { CharacterStateBase } from 'src/views/verse/book/characters/view/character_states/_stateLibrary'
import { ICharacterState } from 'src/views/verse/book/interfaces/ICharacterState'
import { Character } from 'src/views/verse/book/characters/view/Character'

export class Falling extends CharacterStateBase implements ICharacterState {
  constructor(character: Character) {
    super(character)

    this.character.velocitySimulator.mass = 100
    this.character.rotationSimulator.damping = 0.3

    this.character.arcadeVelocityIsAdditive = true
    this.character.setArcadeVelocityInfluence(0.05, 0, 0.05)

    this.playAnimation('falling', 0.3)
  }

  public update(timeStep: number): void {
    super.update(timeStep)

    this.character.setCameraRelativeOrientationTarget()
    this.character.setArcadeVelocityTarget(this.anyDirection() ? 0.8 : 0)

    if (this.character.rayHasHit) {
      this.setAppropriateDropState()
    }
  }
}