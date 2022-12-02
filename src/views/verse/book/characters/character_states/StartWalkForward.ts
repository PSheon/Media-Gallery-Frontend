import { StartWalkBase } from 'src/views/verse/book/characters/character_states/_stateLibrary'
import { Character } from 'src/views/verse/book/characters/Character'

export class StartWalkForward extends StartWalkBase {
  constructor(character: Character) {
    super(character)
    this.animationLength = character.setAnimation('start_forward', 0.1)
  }
}
