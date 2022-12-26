// ** Next Import
import { useRouter } from 'next/router'

const EditSketchbookPage = () => {
  // ** Hooks
  const router = useRouter()

  router.push('/')
}

EditSketchbookPage.acl = {
  action: 'read',
  subject: 'user-page'
}

export default EditSketchbookPage
