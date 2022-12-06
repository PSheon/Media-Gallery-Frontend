export type IAsset = {
  id: number
  attributes: {
    cover?: {
      data?: {
        id: number
        attributes: {
          url: string
        }
      }
    }
    type: string
    displayName: string
    description: string
    owner: {
      data?: {
        id?: number
        attributes: {
          username: string
        }
      }
    }
    views: number
    published: boolean
    publishedAt: string
    createdAt: string
    updatedAt: string

    // scene: {}
  }
}
