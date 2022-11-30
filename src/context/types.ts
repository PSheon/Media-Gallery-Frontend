export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams =
  | {
      message: string
      signature: string
    }
  | {
      email: string
      password: string
      rememberMe?: boolean
    }

export type RegisterParams = {
  email: string
  username: string
  password: string
}

export type GuestDataType = {
  role: 'guest'
  email: string
  fullName: string
  username: string
  avatar?: string | null
}

export type UserDataType = {
  id: number
  role: string
  email: string
  fullName: string
  username: string
  password?: string
  avatar?: string | null
  address: string
}

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  user: UserDataType | GuestDataType
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType | GuestDataType) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
  register: (params: RegisterParams, errorCallback?: ErrCallbackType) => void
}
