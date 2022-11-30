// ** React Imports
import { ReactNode } from 'react'

// ** Next Import
import dynamic from 'next/dynamic'

// ** Component Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Book Import
const Book = dynamic(() => import('src/views/verse/book/sketchbook'), { ssr: false })

function MapPage() {
  return <Book />
}

MapPage.acl = {
  action: 'read',
  subject: 'user-page'
}

MapPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default MapPage
