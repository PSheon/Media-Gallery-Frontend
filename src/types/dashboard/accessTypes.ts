export type IAccess = {
  id: string
  type: 'connect' | 'update_user_data' | 'create_scene'
  ip: string
  browser: string
  country?: string
  description?: string
  highlighted: boolean
  createdAt: string
}
