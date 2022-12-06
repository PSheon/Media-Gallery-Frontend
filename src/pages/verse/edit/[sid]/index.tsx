// ** React Imports
import { ReactNode, useEffect } from 'react'

// ** Next Import
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

// ** Component Import
import Spinner from 'src/layouts/components/spinner'
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Utils Imports
import axios from 'axios'
import toast from 'react-hot-toast'
import { useHMSActions } from '@100mslive/react-sdk'
import { useQuery } from '@tanstack/react-query'

// ** Edit Book Import
const EditSketchbook = dynamic(() => import('src/views/verse/book/EditVerse'), { ssr: false })

// ** Types
import { IScene } from 'src/types/scene/sceneTypes'

function EditSketchbookPage() {
  // ** Hooks
  const hmsActions = useHMSActions()
  const router = useRouter()
  const { sid } = router.query
  const {
    isLoading: isQueryLoading,
    data: sceneBase,
    isError: isQueryError
  } = useQuery({
    queryKey: ['scene'],
    queryFn: () =>
      axios({
        method: 'GET',
        url: `/api/scenes/${sid}`,
        params: {
          populate: ['cover', 'owner', 'collaborators', 'assetList', 'sceneModel']
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

  return <EditSketchbook sceneBase={sceneBase!} />
}

EditSketchbookPage.acl = {
  action: 'read',
  subject: 'user-page'
}

EditSketchbookPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default EditSketchbookPage
