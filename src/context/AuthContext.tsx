// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import { AuthValuesType, RegisterParams, LoginParams, ErrCallbackType, UserDataType, GuestDataType } from './types'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: {
    role: 'guest',
    email: 'anonymous@media.app',
    fullName: 'Anonymous',
    username: 'anonymous'
  },
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | GuestDataType>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      axios.defaults.baseURL =
        process.env.NODE_ENV === 'production' ? 'https://mint.media.app' : 'http://localhost:1337'

      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
      if (storedToken) {
        setLoading(true)

        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`

        await axios({
          method: 'POST',
          url: `/api/auth/me`,
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        })
          .then(async response => {
            setLoading(false)
            setUser(() => ({ ...response.data.userData }))
          })
          .catch(() => {
            localStorage.removeItem('userData')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('accessToken')
            setUser(() => ({
              role: 'guest',
              email: 'anonymous@media.app',
              fullName: 'Anonymous',
              username: 'anonymous'
            }))
            setLoading(false)

            // if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
            //   router.replace('/login')
            // }
            router.replace('/')
          })
      } else {
        setLoading(false)
      }
    }

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    // .post(authConfig.loginEndpoint, params)
    axios
      .post(`/api/auth/connect`, params)
      .then(async response => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`

        window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.accessToken)
        const returnUrl = router.query.returnUrl

        setUser(() => ({ ...response.data.userData }))
        window.localStorage.setItem('userData', JSON.stringify(response.data.userData))

        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'

        router.replace(redirectURL as string)

        // params.rememberMe
        //   ? window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.accessToken)
        //   : null
        // const returnUrl = router.query.returnUrl

        // setUser(() => ({ ...response.data.userData }))
        // params.rememberMe ? window.localStorage.setItem('userData', JSON.stringify(response.data.userData)) : null

        // const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'

        // router.replace(redirectURL as string)
      })

      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    setUser(() => ({ role: 'guest', email: 'anonymous@media.app', fullName: 'Anonymous', username: 'anonymous' }))
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    delete axios.defaults.headers.common['Authorization']

    // router.push('/login')
    router.push('/')
  }

  const handleRegister = (params: RegisterParams, errorCallback?: ErrCallbackType) => {
    axios
      .post(authConfig.registerEndpoint, params)
      .then(res => {
        if (res.data.error) {
          if (errorCallback) errorCallback(res.data.error)
        } else {
          handleLogin({ email: params.email, password: params.password })
        }
      })
      .catch((err: { [key: string]: string }) => (errorCallback ? errorCallback(err) : null))
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }