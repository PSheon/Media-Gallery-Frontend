// ** React Imports
import { ReactNode } from 'react'

// ** Next Import
import dynamic from 'next/dynamic'

// ** Component Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Book Import
const Book = dynamic(() => import('src/views/verse/book/Sketchbook'), { ssr: false })

function VerseBookPage() {
  return <Book />
}

VerseBookPage.acl = {
  action: 'read',
  subject: 'guest-page'
}

VerseBookPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default VerseBookPage
