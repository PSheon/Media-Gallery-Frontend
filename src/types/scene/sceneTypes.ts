export type FetchSceneParamsType = {
  sort?: string[]
  filters?: Record<string, Record<string, string>>
  populate?: string
  fields?: string[]
  pagination?: {
    pageSize?: number
    page?: number
  }
  publicationState?: string
  locale?: string[]
}

export type IScene = {
  id: number
  attributes: {
    sceneId: string
    displayName: string
    description?: string
    cover?: {
      id?: number
      data: any
    }
    worldScenePaths: string
    nftList: string
    published: boolean
    featured: boolean
    publishedAt: string
    createdAt: string
    updatedAt: string
  }
}

export type IResponse = {
  data: IScene[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}
