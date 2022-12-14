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

export interface GetMeSceneModelResponse {
  data: ISceneModel[]
  meta: {}
}

export type ISceneModel = {
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
    displayName: string
    description?: string
    contract?: string
    tagIcon?: string
    tagTitle?: string
    frameCount: number
    worldScenePaths: string[]

    creator: {
      data?: {
        id?: number
        attributes: {
          username: string
        }
      }
    }
    published: boolean
    publishedAt: string
    createdAt: string
    updatedAt: string
  }
}

export type IResponse = {
  data: ISceneModel[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}
