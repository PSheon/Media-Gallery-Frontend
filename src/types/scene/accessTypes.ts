import { IUser } from 'src/types/scene/userTypes'

export type IAccess = {
  id: number
  attributes: {
    user: {
      data: IUser
    }
    description: string
    type: string
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
