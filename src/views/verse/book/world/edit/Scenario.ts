import { ISpawnPoint } from 'src/views/verse/book/interfaces/edit/ISpawnPoint'
import { World } from 'src/views/verse/book/world/EditWorld'
import { LoadingManager } from 'src/views/verse/book/core/edit/LoadingManager'

export class Scenario {
  public id: string
  public name = 'edit'
  public spawnAlways = false
  public default = false
  public world: World
  public descriptionTitle = 'Edit Scene'
  public descriptionContent = 'Welcome to edit mode'

  private rootNode: THREE.Object3D
  private spawnPoints: ISpawnPoint[] = []
  private invisible = false
  private initialCameraAngle = 0

  constructor(root: THREE.Object3D, world: World) {
    this.rootNode = root
    this.world = world
    this.id = root.name

    // Scenario
    if (root.userData.hasOwnProperty('name')) {
      this.name = root.userData.name
    }
    if (root.userData.hasOwnProperty('default') && root.userData.default === 'true') {
      this.default = true
    }
    if (root.userData.hasOwnProperty('spawn_always') && root.userData.spawn_always === 'true') {
      this.spawnAlways = true
    }
    if (root.userData.hasOwnProperty('invisible') && root.userData.invisible === 'true') {
      this.invisible = true
    }
    if (root.userData.hasOwnProperty('desc_title')) {
      this.descriptionTitle = root.userData.desc_title
    }
    if (root.userData.hasOwnProperty('desc_content')) {
      this.descriptionContent = root.userData.desc_content
    }
    if (root.userData.hasOwnProperty('camera_angle')) {
      this.initialCameraAngle = root.userData.camera_angle
    }

    if (!this.invisible) this.createLaunchLink()

    // Find all scenario spawns and enitites
    root.traverse(child => {
      if (child.hasOwnProperty('userData') && child.userData.hasOwnProperty('data')) {
        if (child.userData.data === 'spawn') {
          if (child.userData.type === 'npc') {
            // const sp = new NpcSpawnPoint(child)
            // this.spawnPoints.push(sp)
          }
        }
      }
    })
  }

  public createLaunchLink(): void {
    // @ts-ignore
    this.world.params[this.name] = () => {
      this.world.launchScenario(this.id)
    }

    // this.world.scenarioGUIFolder.add(this.world.params, this.name)
  }

  public launch(loadingManager: LoadingManager, world: World): void {
    this.spawnPoints.forEach(sp => {
      // @ts-ignore
      sp.spawn(loadingManager, world)
    })

    if (!this.spawnAlways) {
      loadingManager.createWelcomeScreenCallback(this)

      world.cameraOperator.theta = this.initialCameraAngle
      world.cameraOperator.phi = 15
    }
  }
}
