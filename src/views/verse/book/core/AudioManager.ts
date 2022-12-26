import { Howl } from 'howler'
import { World } from 'src/views/verse/book/world/World'

export class AudioManager {
  private world: World
  private backgroundAudio: Howl

  constructor(world: World) {
    this.world = world
    this.backgroundAudio = new Howl({
      src: '/audios/background-music.mp3',
      loop: true,
      volume: 0.1
    })
  }

  public play(volume: number): void {
    this.backgroundAudio.volume(volume)
    this.backgroundAudio.play()
  }

  public pause(): void {
    this.backgroundAudio.pause()
  }

  public adjustVolume(newVolume: number): void {
    this.backgroundAudio.volume(newVolume)
  }

  public dispose() {
    this.backgroundAudio.stop()
  }
}
