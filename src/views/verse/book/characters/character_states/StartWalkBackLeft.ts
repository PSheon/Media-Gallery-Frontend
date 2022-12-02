import { StartWalkBase } from 'src/views/verse/book/characters/character_states/_stateLibrary'
import { Character } from 'src/views/verse/book/characters/Character'

export class StartWalkBackLeft extends StartWalkBase {
  constructor(character: Character) {
    super(character)
    this.animationLength = character.setAnimation('start_back_left', 0.1)
  }
}
