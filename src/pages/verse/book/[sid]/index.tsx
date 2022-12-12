// ** React Imports
import { useEffect, ReactNode } from 'react'

// ** Next Import
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

// ** Component Import
import Spinner from 'src/layouts/components/spinner'
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Utils Imports
import axios from 'axios'
import toast from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import { useHMSActions } from '@100mslive/react-sdk'

// ** View Book Import
const ViewSketchbook = dynamic(() => import('src/views/verse/book/ViewVerse'), { ssr: false })

// ** Types
import { IScene } from 'src/types/scene/sceneTypes'

function ViewVersePage() {
  // ** Hooks
  const router = useRouter()
  const { sid } = router.query
  const hmsActions = useHMSActions()
  const {
    isLoading: isQueryLoading,
    data: sceneBase,
    isError: isQueryError
  } = useQuery({
    queryKey: ['scene_assetList'],
    queryFn: () =>
      axios({
        method: 'GET',
        url: `/api/scenes/${sid}`,
        params: {
          populate: {
            cover: true,
            owner: true,
            collaborators: true,
            assetList: {
              populate: {
                cover: true
              }
            },
            sceneModel: true
          }
        }
      }).then(response => response.data.data as IScene),
    enabled: !!sid,
    retry: 0
  })

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

  return <ViewSketchbook sceneBase={sceneBase!} />
}

ViewVersePage.acl = {
  action: 'read',
  subject: 'guest-page'
}

ViewVersePage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default ViewVersePage
