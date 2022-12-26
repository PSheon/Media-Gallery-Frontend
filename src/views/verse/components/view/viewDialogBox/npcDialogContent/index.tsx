// ** React Imports
import { Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

interface Props {
  handleViewDialogBoxClose: () => void
  npcMetadata: {
    framePosition: string
    displayName: string
    position: {
      x: number
      y: number
      z: number
    }
    rotation: {
      x: number
      y: number
      z: number
    }
  }
}

const NpcDialogContent = (props: Props) => {
  // ** Props
  const { handleViewDialogBoxClose, npcMetadata } = props

  return (
    <Fragment>
      <DialogContent sx={{ backgroundColor: theme => theme.palette.action.hover }}>
        <IconButton
          size='small'
          onClick={handleViewDialogBoxClose}
          sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
        >
          <Icon icon='mdi:close-circle' fontSize={20} />
        </IconButton>
        <Box sx={{ mb: 8, textAlign: 'center' }}>
          <Typography variant='h5' sx={{ mb: 3 }}>
            {npcMetadata.displayName}
          </Typography>
        </Box>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={5}>
            <Typography variant='h5' sx={{ mb: 3 }}>
              {npcMetadata.displayName}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={7}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography variant='caption'>description</Typography>
                <Typography variant='subtitle2'>no description</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
    </Fragment>
  )
}

export default NpcDialogContent
