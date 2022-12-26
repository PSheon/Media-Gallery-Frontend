// ** React Imports
import { useEffect, ReactNode } from 'react'

// ** Next Import
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

// ** Component Import
import Spinner from 'src/layouts/components/spinner'
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Services Imports
import { useSceneQuery } from 'src/services/queries/scene.query'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Utils Imports
import toast from 'react-hot-toast'
import { useHMSActions } from '@100mslive/react-sdk'

// ** Config
import apiConfig from 'src/configs/api'

// ** View Book Import
const ViewSketchbook = dynamic(() => import('src/views/verse/book/ViewVerse'), { ssr: false })

function ViewVersePage() {
  // ** Hooks
  const router = useRouter()
  const { sid } = router.query
  const auth = useAuth()
  const hmsActions = useHMSActions()
  const { isLoading: isQueryLoading, data: queryData, isError: isQueryError } = useSceneQuery({ sid: sid as string })
  const sceneBase = queryData?.data

  // ** Side Effect
  useEffect(() => {
    return () => {
      hmsActions.leave()
    }
  }, [hmsActions])

  if (isQueryError) {
    toast.error('Fetch scene failed')
    router.push('/')
  }

  if (isQueryLoading) {
    return <Spinner />
  }

  return (
    <ViewSketchbook
      sceneBase={sceneBase!}
      playerDisplayName={auth.user.username}
      playerAvatarURL={
        auth.user.avatar ? `${apiConfig.publicFolderUrl}${auth.user.avatar as string}` : '/images/avatars/1.png'
      }
    />
  )
}

ViewVersePage.acl = {
  action: 'read',
  subject: 'guest-page'
}

ViewVersePage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default ViewVersePage
