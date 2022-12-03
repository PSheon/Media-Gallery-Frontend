import * as THREE from 'three'
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { LoadingTrackerEntry } from 'src/views/verse/book/core/LoadingTrackerEntry'
import { UIManager } from 'src/views/verse/book/core/view/UIManager'
import { Scenario } from 'src/views/verse/book/world/view/Scenario'
import { World } from 'src/views/verse/book/world/World'

import {
  SET_LOADING_PROGRESS,
  SHOW_START_PANEL_ACTION,
  SET_START_PANEL_ACTION
} from 'src/views/verse/book/actions/view'

export class LoadingManager {
  public isRestartLoading = false
  public onFinishedCallback: any = undefined
  public loadingProgress = new THREE.LoadingManager()
  public gltfLoader: GLTFLoader

  private world: World
  private dracoLoader: DRACOLoader
  private loadingTracker: LoadingTrackerEntry[] = []

  constructor(world: World) {
    this.world = world
    this.dracoLoader = new DRACOLoader()
    this.dracoLoader.setDecoderPath('/lib/draco/')
    this.gltfLoader = new GLTFLoader(this.loadingProgress)
    this.gltfLoader.setDRACOLoader(this.dracoLoader)

    this.world.setTimeScale(0)
    UIManager.setUserInterfaceVisible(false)
    UIManager.setLoadingScreenVisible(true)
  }

  public loadGLTF(path: string, onLoadingFinished: (gltf: GLTF) => void): void {
    this.loadingProgress.onProgress = (url, itemsLoaded, itemsTotal) => {
      SET_LOADING_PROGRESS({
        percentage: (itemsLoaded / itemsTotal) * 100,
        content: `Loading Scene ${itemsLoaded}/${itemsTotal} ...`
      })
    }

    const trackerEntry = this.addLoadingEntry(path)

    this.gltfLoader.load(
      path,
      gltf => {
        onLoadingFinished(gltf)
        this.doneLoading(trackerEntry)
      },
      xhr => {
        if (xhr.lengthComputable) {
          trackerEntry.progress = xhr.loaded / xhr.total
        }
      },
      error => {
        console.error(error)
      }
    )
  }

  public addLoadingEntry(path: string): LoadingTrackerEntry {
    const entry = new LoadingTrackerEntry(path)
    this.loadingTracker.push(entry)

    return entry
  }

  public doneLoading(trackerEntry: LoadingTrackerEntry): void {
    trackerEntry.finished = true
    trackerEntry.progress = 1

    if (this.isLoadingDone()) {
      if (this.onFinishedCallback !== undefined) {
        this.onFinishedCallback()
      } else {
        // UIManager.setUserInterfaceVisible(true)
      }

      if (this.isRestartLoading) {
        UIManager.setLoadingScreenVisible(false)
      }
    }
  }

  public createWelcomeScreenCallback(scenario: Scenario): void {
    if (this.onFinishedCallback === undefined) {
      this.onFinishedCallback = () => {
        this.world.update(1, 1)

        SHOW_START_PANEL_ACTION()
        SET_START_PANEL_ACTION({
          title: scenario.descriptionTitle,
          content: scenario.descriptionContent,
          confirmButtonText: 'Visit world',
          closeCallback: () => {
            this.world.setTimeScale(1)
            UIManager.setUserInterfaceVisible(true)
          }
        })
      }
    }
  }

  // private getLoadingPercentage(): number {
  //   let done = true
  //   let total = 0
  //   let finished = 0

  //   for (const item of this.loadingTracker) {
  //     total++
  //     finished += item.progress
  //     if (!item.finished) done = false
  //   }

  //   return (finished / total) * 100
  // }

  private isLoadingDone(): boolean {
    for (const entry of this.loadingTracker) {
      if (!entry.finished) return false
    }

    return true
  }
}
