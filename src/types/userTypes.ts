export type IUser = {
  id: number
  attributes: {
    avatar: {
      data?: {
        id: number
        attributes: {
          url: string
        }
      }
    }
    email: string
    username: string
    address: string

    // role: {}
    // accesses: {}
    // sceneModels: {}
    // sceneAssets: {}
    confirmed: boolean
    blocked: boolean
    published: boolean
    publishedAt: string
    createdAt: string
    updatedAt: string
  }
}
