// ** React Imports
import { Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// **  Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import SceneModelSelectionList from 'src/views/verse/components/create/SceneModelSelectionList'

const VerseCreatePage = () => {
  return (
    <Fragment>
      <Box sx={{ mt: 13, textAlign: 'center' }}>
        <CustomChip size='small' skin='light' color='primary' label='Question' />
        <Typography variant='h5' sx={{ mt: 1.5, mb: 2 }}>
          Choose a Scene
        </Typography>
        <Typography sx={{ mb: 10, color: 'text.secondary' }}>
          Select the scene you'll use to show your NFTs. Some are designed by select architects and minted in limited
          editions as NFTs.
        </Typography>
      </Box>

      <SceneModelSelectionList />
    </Fragment>
  )
}

VerseCreatePage.acl = {
  action: 'read',
  subject: 'user-page'
}

export default VerseCreatePage
