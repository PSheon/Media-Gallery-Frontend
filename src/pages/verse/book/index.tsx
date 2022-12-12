// ** Next Import
import { useRouter } from 'next/router'

const ViewSketchbookPage = () => {
  // ** Hooks
  const router = useRouter()

  router.push('/')
}

ViewSketchbookPage.acl = {
  action: 'read',
  subject: 'user-page'
}

export default ViewSketchbookPage
