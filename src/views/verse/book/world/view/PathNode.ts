import { Object3D } from 'three'
import { Path } from 'src/views/verse/book/world/view/Path'

export class PathNode {
  public object: Object3D
  public path: Path

  // @ts-ignore
  public nextNode: PathNode

  // @ts-ignore
  public previousNode: PathNode

  constructor(child: THREE.Object3D, path: Path) {
    this.object = child
    this.path = path
  }
}
