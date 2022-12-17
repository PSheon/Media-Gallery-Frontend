import { Howl } from 'howler'
import { Character } from 'src/views/verse/book/characters/view/Character'

export class CharacterAudioManager {
  private character: Character
  private clickSoundAudioManager: Howl
  private walkSoundAudioManager: Howl
  private jumpSoundAudioManager: Howl

  constructor(character: Character) {
    this.character = character
    this.clickSoundAudioManager = new Howl({
      src: ['/audios/click.mp3'],
      volume: 0.3
    })
    this.walkSoundAudioManager = new Howl({
      src: ['/audios/footstep.mp3'],
      loop: true,
      rate: 3,
      volume: 0.05
    })
    this.jumpSoundAudioManager = new Howl({
      src: ['/audios/jump.mp3'],
      volume: 0.05
    })
  }

  public play(clipName: string): void {
    if (clipName === 'click') {
      this.clickSoundAudioManager.play()
    }
    if (clipName === 'walk') {
      this.walkSoundAudioManager.play()
    }
    if (clipName === 'jump') {
      this.jumpSoundAudioManager.play()
    }
  }

  public stop(clipName: string): void {
    if (clipName === 'click') {
      this.clickSoundAudioManager.stop()
    }
    if (clipName === 'walk') {
      this.walkSoundAudioManager.stop()
    }
    if (clipName === 'jump') {
      this.jumpSoundAudioManager.stop()
    }
    if (clipName === 'all') {
      this.clickSoundAudioManager.stop()
      this.walkSoundAudioManager.stop()
      this.jumpSoundAudioManager.stop()
    }
  }

  public adjustRate(clipName: string, newRate: number): void {
    if (clipName === 'click') {
      this.clickSoundAudioManager.rate(newRate)
    }
    if (clipName === 'walk') {
      this.walkSoundAudioManager.play(newRate)
    }
    if (clipName === 'jump') {
      this.jumpSoundAudioManager.play(newRate)
    }
  }

  public adjustVolume(newVolume: number): void {
    this.clickSoundAudioManager.volume(newVolume)
    this.walkSoundAudioManager.volume(newVolume)
    this.jumpSoundAudioManager.volume(newVolume)
  }

  public dispose() {
    this.clickSoundAudioManager.stop()
    this.walkSoundAudioManager.stop()
    this.jumpSoundAudioManager.stop()
  }
}
