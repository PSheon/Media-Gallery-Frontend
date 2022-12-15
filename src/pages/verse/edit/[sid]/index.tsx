// ** React Imports
import { ReactNode } from 'react'

// ** Next Import
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

// ** Component Import
import Spinner from 'src/layouts/components/spinner'
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Services Imports
import { useSceneQuery } from 'src/services/queries/scene.query'

// ** Utils Imports
import toast from 'react-hot-toast'

// ** Edit Book Import
const EditSketchbook = dynamic(() => import('src/views/verse/book/EditVerse'), { ssr: false })

function EditVersePage() {
  // ** Hooks
  const router = useRouter()
  const { sid } = router.query
  const { isLoading: isQueryLoading, data: queryData, isError: isQueryError } = useSceneQuery({ sid: sid as string })
  const sceneBase = queryData?.data

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
