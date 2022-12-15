// ** Types Imports
import { IUser } from 'src/types/userTypes'

export interface GetMeAccessesProps {
  limit: number
}

export interface GetAccessesResponse {
  data: IAccess[]
  meta: {}
}

export type IAccessType = 'connect' | 'update_user_data' | 'create_scene'

export type IAccess = {
  id: number
  attributes: {
    user: {
      data: IUser
    }
    description: string
    type: IAccessType
    ip: string
    browser: string
    country: string
    highlighted: boolean
    published: boolean
    publishedAt: string
    createdAt: string
    updatedAt: string
  }
}
