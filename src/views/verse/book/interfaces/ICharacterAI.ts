import { Character } from 'src/views/verse/book/characters/Character'

export interface ICharacterAI {
  character: Character
  update(timeStep: number): void
}
