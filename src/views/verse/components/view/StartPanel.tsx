// ** React Imports
import { Ref, forwardRef, ReactElement } from 'react'

// ** Next Import
import Image from 'next/image'
import { useRouter } from 'next/router'

// ** Redux Imports
import { useDispatch, useSelector } from 'react-redux'

// ** MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, Theme } from '@mui/material/styles'
import LoadingButton from '@mui/lab/LoadingButton'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Badge from '@mui/material/Badge'
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'

// ** Services Imports
import { useSceneQuery } from 'src/services/queries/scene.query'

// ** Actions Imports
import { hideStartPanel } from 'src/store/verse/view/startPanelSlice'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Utils
import { etherAddressFormatter } from 'src/utils/ether-address-formatter'

// ** Config
import apiConfig from 'src/configs/api'

// ** Types
import { RootState, AppDispatch } from 'src/store'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

// ** Styled Components
const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))
const StyledDialog = styled(Dialog)(() => ({
  '& .MuiDialog-paper': {
    background: 'transparent'
  }
}))
const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: theme.spacing(8, 15),
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(4, 6)
  }
}))

const StartPanel = () => {
  // ** Hooks
  const auth = useAuth()
  const router = useRouter()
  const { sid } = router.query
  const dispatch = useDispatch<AppDispatch>()
  const START_PANEL = useSelector(({ verse }: RootState) => verse.view.startPanel)
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))
  const { isLoading: isQueryLoading, data: sceneBase } = useSceneQuery({ sid: sid as string })

  // ** Logics
  const handleConfirm = () => {
    dispatch(hideStartPanel())

    START_PANEL.closeCallback()
  }

  // ** Renders
  const renderControlHintSection = () => {
    if (isDesktop) {
      return (
        <Grid container justifyContent='space-between'>
          <Grid item xs={5} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Box sx={{ mb: 2 }}>
                <Image width={128} height={96} src='/images/verse/keyboard.png' alt='keyboard' />
              </Box>
              <Typography variant='subtitle1' color='common.white' align='left'>
                use your keyboard to move
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={5} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <Box sx={{ mb: 2 }}>
                <Image width={108} height={96} src='/images/verse/mouse-move.png' alt='mouse move' />
              </Box>
              <Typography variant='subtitle1' color='common.white' align='right'>
                use your mouse to rotate
              </Typography>
            </Box>
          </Grid>
        </Grid>
      )
    }

    return (
      <Grid container justifyContent='space-between' alignItems='flex-end'>
        <Grid item xs={5} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Box sx={{ mb: 2 }}>
              <Image width={60} height={60} src='/images/verse/joystick.png' alt='joystick' />
            </Box>
            <Typography variant='body2' color='common.white' align='left'>
              use joystick to move
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={5} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <Box sx={{ mb: 2 }}>
              <Image width={60} height={60} src='/images/verse/mouse-move.png' alt='mouse move' />
            </Box>
            <Typography variant='body2' color='common.white' align='right'>
              swipe to rotate
            </Typography>
          </Box>
        </Grid>
      </Grid>
    )
  }

  return (
    <StyledDialog fullScreen open={START_PANEL.show} onClose={handleConfirm} TransitionComponent={Transition}>
      <StyledDialogContent>
        <Grid container>
          <Grid item xs={6}>
            <Avatar
              src='/images/logos/media-app.png'
              alt='media.app'
              sx={{ width: 48, height: 48, boxShadow: theme => theme.shadows[9] }}
            />
          </Grid>
          <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', mr: 4, alignItems: 'flex-end', flexDirection: 'column' }}>
                <Typography sx={{ fontWeight: 600 }} color='common.white'>
                  {auth.user.username}
                </Typography>
                <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
                  {auth.user?.address ? `${etherAddressFormatter(auth.user.address)}` : 'guest'}
                </Typography>
              </Box>
              <Badge
                overlap='circular'
                badgeContent={<BadgeContentSpan />}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right'
                }}
              >
                <Avatar
                  alt={auth.user.username}
                  src={
                    auth.user.avatar
                      ? `${apiConfig.publicFolderUrl}${auth.user.avatar as string}`
                      : '/images/avatars/1.png'
                  }
                  sx={{
                    width: '2.5rem',
                    height: '2.5rem',
                    border: theme => `2px solid ${theme.palette.primary.main}`,
                    boxShadow: theme => theme.shadows[9]
                  }}
                />
              </Badge>
            </Box>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={12} sx={{ mb: 6 }}>
            <Typography variant='h3' sx={{ mb: 3 }} color='common.white'>
              {sceneBase?.attributes.displayName}
            </Typography>
            <Typography variant='body1' color='common.white'>
              {sceneBase?.attributes.description ?? 'no description'}
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{ mt: 6 }}>
            <LoadingButton loading={isQueryLoading} variant='contained' onClick={handleConfirm} size='large'>
              Enter World
            </LoadingButton>
          </Grid>
        </Grid>

        {renderControlHintSection()}
      </StyledDialogContent>
    </StyledDialog>
  )
}

export default StartPanel
