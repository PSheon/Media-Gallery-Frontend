// ** React Imports
import { ReactNode } from 'react'

// ** Next Import
import dynamic from 'next/dynamic'

// ** Component Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Book Import
const ViewVerse = dynamic(() => import('src/views/verse/book/ViewVerse'), { ssr: false })

function ViewVersePage() {
  return <ViewVerse />
}

ViewVersePage.acl = {
  action: 'read',
  subject: 'guest-page'
}

ViewVersePage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default ViewVersePage
