// ** React Imports
import { useDispatch } from 'react-redux'

// ** MUI Imports
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// ** Actions Imports
import { hideDialogBox } from 'src/store/verse/view/viewDialogBoxSlice'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

interface Props {
  artworkMetadata: {
    displayName: string
    description: string
    contentURL: string
    openseaURL?: string
  }
}

// ** Styled Grid component
const StyledGrid = styled(Grid)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.down('md')]: {
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  [theme.breakpoints.up('md')]: {
    borderRight: `1px solid ${theme.palette.divider}`
  }
}))

// ** Styled component for the image
const Img = styled('img')({
  width: '100%',
  height: '100%',
  objectPosition: 'center',
  objectFit: 'cover',
  borderRadius: '.2rem'
})

const ViewNftBox = (props: Props) => {
  // ** Props
  const { artworkMetadata } = props

  // ** Hooks
  const dispatch = useDispatch()

  // ** Logics
  const handleDialogClose = () => {
    dispatch(hideDialogBox())
  }

  return (
    <Grid container spacing={6} sx={{ minHeight: '20rem' }}>
      <StyledGrid item md={4} xs={12}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Img alt={artworkMetadata.description} src={artworkMetadata.contentURL} />
        </CardContent>
      </StyledGrid>
      <Grid
        item
        xs={12}
        md={8}
        sx={{
          display: 'flex',
          pt: ['0 !important', '0 !important', '1.5rem !important'],
          pl: ['1.5rem !important', '1.5rem !important', '0 !important']
        }}
      >
        <CardContent sx={{ position: 'relative', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <IconButton
            size='small'
            onClick={handleDialogClose}
            sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
          >
            <Icon icon='mdi:close-circle' fontSize={20} />
          </IconButton>

          <Typography variant='h6' sx={{ mb: 2 }}>
            {artworkMetadata.displayName}
          </Typography>
          <Typography variant='body2'>{artworkMetadata.description}</Typography>

          {artworkMetadata?.openseaURL && (
            <Box sx={{ mt: 'auto' }}>
              <Button variant='outlined' target='_blank' href={artworkMetadata.openseaURL}>
                <Typography variant='subtitle2' sx={{ fontWeight: 600 }}>
                  Opensea
                </Typography>
              </Button>
            </Box>
          )}
        </CardContent>
      </Grid>
    </Grid>
  )
}

export default ViewNftBox
