import * as THREE from 'three'
import { SeatType } from 'src/views/verse/book/enums/SeatType'

// import { Side } from 'src/views/verse/book/enums/Side'
import { IControllable } from 'src/views/verse/book/interfaces/IControllable'
import { VehicleDoor } from 'src/views/verse/book/vehicles/view/VehicleDoor'

// import { Vehicle } from 'src/views/verse/book/vehicles/view/Vehicle'
import { Character } from 'src/views/verse/book/characters/view/Character'

export class VehicleSeat {
  public vehicle: IControllable
  public seatPointObject: THREE.Object3D

  // String of names of connected seats
  // @ts-ignore
  public connectedSeatsString: string

  // Actual seatPoint objects, need to be identified
  // by parsing connectedSeatsString *after* all seats are imported
  public connectedSeats: VehicleSeat[] = []

  // @ts-ignore
  public type: SeatType
  public entryPoints: THREE.Object3D[] = []

  // @ts-ignore
  public door: VehicleDoor

  public occupiedBy: Character | undefined

  constructor(vehicle: IControllable, object: THREE.Object3D, gltf: any) {
    this.vehicle = vehicle
    this.seatPointObject = object

    if (object.hasOwnProperty('userData') && object.userData.hasOwnProperty('data')) {
      if (object.userData.hasOwnProperty('door_object')) {
        this.door = new VehicleDoor(this, gltf.scene.getObjectByName(object.userData.door_object))
      }

      if (object.userData.hasOwnProperty('entry_points')) {
        const entry_points = (object.userData.entry_points as string).split(';')
        for (const entry_point of entry_points) {
          if (entry_point.length > 0) {
            this.entryPoints.push(gltf.scene.getObjectByName(entry_point))
          }
        }
      } else {
        console.error('Seat object ' + object + ' has no entry point reference property.')
      }

      if (object.userData.hasOwnProperty('seat_type')) {
        this.type = object.userData.seat_type
      } else {
        console.error('Seat object ' + object + ' has no seat type property.')
      }

      if (object.userData.hasOwnProperty('connected_seats')) {
        this.connectedSeatsString = object.userData.connected_seats
      }
    }
  }

  public update(timeStep: number): void {
    if (this.door !== undefined) {
      this.door.update(timeStep)
    }
  }
}
