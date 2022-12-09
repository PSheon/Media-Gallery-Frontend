// ** React Imports
import { ReactNode } from 'react'

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

// ** Edit Book Import
const EditSketchbook = dynamic(() => import('src/views/verse/book/EditVerse'), { ssr: false })

// ** Types
import { IScene } from 'src/types/scene/sceneTypes'

function EditVersePage() {
  // ** Hooks
  const router = useRouter()
  const { sid } = router.query
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

  if (isQueryError) {
    toast.error('Fetch scene failed')
    router.push('/')
  }

  if (isQueryLoading) {
    return <Spinner />
  }

  return <EditSketchbook sceneBase={sceneBase!} />
}

EditVersePage.acl = {
  action: 'read',
  subject: 'user-page'
}

EditVersePage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default EditVersePage
