// ** React Imports
import { ReactNode } from 'react'

// ** Next Import
import dynamic from 'next/dynamic'

// ** Component Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Edit Book Import
const EditSketchbook = dynamic(() => import('src/views/verse/book/EditVerse'), { ssr: false })

function EditSketchbookPage() {
  return <EditSketchbook />
}

EditSketchbookPage.acl = {
  action: 'read',
  subject: 'user-page'
}

EditSketchbookPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default EditSketchbookPage
