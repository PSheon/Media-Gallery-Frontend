// ** React Imports
import { Ref, forwardRef, ReactElement } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// ** MUI Imports
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Fade, { FadeProps } from '@mui/material/Fade'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// ** Actions Imports
import { setDialogBoxStep, hideDialogBox } from 'src/store/verse/view/dialogBoxSlice'

// ** Components Imports
import ViewNftBox from 'src/views/verse/components/view/dialogBox/ViewNftBox'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { RootState } from 'src/store'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

// Styled StyledRootDialog component
const StyledRootDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-container': {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    paddingBottom: theme.spacing(6),
    zIndex: theme.zIndex.drawer + 1
  }
}))

// Styled Grid component
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

const DialogBox = () => {
  // ** Hooks
  const dispatch = useDispatch()
  const auth = useAuth()
  const DIALOG_BOX = useSelector(({ verse }: RootState) => verse.view.dialogBox)
  const SCENE_METADATA = useSelector(({ verse }: RootState) => verse.view.scene)
  const worldInstance = useSelector(({ verse }: RootState) => verse.view.scene.worldInstance)
  const hasNext = DIALOG_BOX.step + 1 < DIALOG_BOX.session.length
  const { owner, nftList: SCENE_NFT_LIST } = SCENE_METADATA

  if (worldInstance) {
    if (DIALOG_BOX.show) {
      worldInstance.setDialogMode(true)
    } else {
      worldInstance.setDialogMode(false)
    }
  }

  // TODO: fixed redirect duplicated character issues.
  const handleRestartScene = (destination: string) => {
    const newURL = new URL(window.location.href)
    newURL.searchParams.set('scene', destination)
    window.history.pushState({}, '', newURL)

    dispatch(hideDialogBox())
    worldInstance?.restartScene()
  }

  const handleNextStep = () => {
    dispatch(setDialogBoxStep())
  }

  const handleDialogClose = () => {
    dispatch(hideDialogBox())
  }

  const renderSession = (currentSession: {
    nftFrameId: string
    playerDisplayName: string
    type: string
    speaker: string
    content: string
    destination: string
  }) => {
    if (currentSession?.type === 'dialog') {
      return (
        <DialogContent sx={{ position: 'relative' }}>
          <IconButton
            size='small'
            onClick={handleDialogClose}
            sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
          >
            <Icon icon='mdi:close-circle' fontSize={20} />
          </IconButton>

          <Box sx={{ px: 4 }}>
            <Typography variant='h5' sx={{ mb: 3 }}>
              {currentSession.speaker ?? 'Crazy Bug'}
            </Typography>
            <Box sx={{ minHeight: '5rem', display: 'flex', flexDirection: 'column' }}>
              <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                {currentSession.content}
              </Typography>
            </Box>
          </Box>

          {hasNext && (
            <Box sx={{ position: 'absolute', right: '1rem', bottom: '1rem' }}>
              <Button variant={hasNext ? 'text' : 'contained'} onClick={handleNextStep}>
                <Typography variant='subtitle2' sx={{ fontWeight: 600 }}>
                  ... more
                </Typography>
              </Button>
            </Box>
          )}
        </DialogContent>
      )
    }

    if (currentSession?.type === 'redirect') {
      return (
        <DialogContent sx={{ position: 'relative' }}>
          <IconButton size='small' onClick={handleDialogClose} sx={{ position: 'absolute', right: 0, top: 0 }}>
            <Icon icon='mdi:close-circle' fontSize={20} />
          </IconButton>

          <Box sx={{ px: 4 }}>
            <Typography variant='h5' sx={{ mb: 3 }}>
              {currentSession.speaker ?? 'Crazy Bug'}
            </Typography>
            <Box sx={{ minHeight: '5rem', display: 'flex', flexDirection: 'column' }}>
              <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                {currentSession.content}
              </Typography>
            </Box>
            <Box sx={{ mt: 'auto' }}>
              <Button variant='contained' onClick={() => handleRestartScene(currentSession.destination)}>
                <Typography variant='subtitle2' sx={{ fontWeight: 600 }}>
                  Let's go
                </Typography>
              </Button>
            </Box>
          </Box>

          {hasNext && (
            <Box sx={{ position: 'absolute', right: '1rem', bottom: '1rem' }}>
              <Button variant={hasNext ? 'text' : 'contained'} onClick={handleNextStep}>
                <Typography variant='subtitle2' sx={{ fontWeight: 600 }}>
                  ... more
                </Typography>
              </Button>
            </Box>
          )}
        </DialogContent>
      )
    }

    if (currentSession?.type === 'artworkInfo') {
      const artworkMetadata = Object.assign(
        {
          displayName: 'Media Verse',
          description: 'Media is so cool...',
          contentURL: '/images/logos/media-app.png'
        },
        SCENE_NFT_LIST.find(nftData => nftData.frameId === currentSession.nftFrameId)
      )

      /* NOTE: added public access */
      // if (owner === 'media' || owner === account) {
      //   return <EditNftBox artworkMetadata={artworkMetadata} currentSession={currentSession} />
      // } else {
      //   return <ViewNftBox artworkMetadata={artworkMetadata} />
      // }

      return <ViewNftBox artworkMetadata={artworkMetadata} />
    }

    if (currentSession?.type === 'playerInfo') {
      return (
        <Grid container spacing={6} sx={{ minHeight: '20rem' }}>
          <StyledGrid item md={4} xs={12}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Img alt={currentSession.playerDisplayName} src={'/images/avatars/1.png'} />
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
                <Close />
              </IconButton>

              <Typography variant='h6' sx={{ mb: 2 }}>
                {currentSession.playerDisplayName}
              </Typography>

              <Box sx={{ mt: 'auto' }}>
                <Button variant='outlined' disabled>
                  <Typography variant='subtitle2' sx={{ fontWeight: 600 }}>
                    Add Friend
                  </Typography>
                </Button>
              </Box>
            </CardContent>
          </Grid>
        </Grid>
      )
    }
  }

  return (
    <StyledRootDialog
      fullWidth
      open={DIALOG_BOX.show}
      maxWidth='md'
      scroll='paper'
      onClose={handleDialogClose}
      TransitionComponent={Transition}
      onBackdropClick={handleDialogClose}
    >
      {renderSession(DIALOG_BOX.session[DIALOG_BOX.step])}
    </StyledRootDialog>
  )
}

export default DialogBox
