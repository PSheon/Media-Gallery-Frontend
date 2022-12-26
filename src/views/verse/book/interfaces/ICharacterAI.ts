import { Character } from 'src/views/verse/book/characters/view/Character'

export interface ICharacterAI {
  character: Character
  update(timeStep: number): void
}
