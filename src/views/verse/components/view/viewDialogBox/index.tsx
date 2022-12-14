/* TODO */
// ** React Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// ** Services Imports
import { useSceneQuery } from 'src/services/queries/scene.query'

// ** Actions Imports
import { hideViewDialogBox } from 'src/store/verse/view/viewDialogBoxSlice'

// ** Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Config
import apiConfig from 'src/configs/api'

// ** Types
import { RootState } from 'src/store'
import { ISceneAsset } from 'src/types/sceneAssetTypes'

// Styled StyledRootDialog component
const StyledRootDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-container': {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: theme.spacing(6)
  }
}))

const ViewDialogBox = () => {
  // ** Hooks
  const router = useRouter()
  const { sid } = router.query
  const dispatch = useDispatch()
  const worldInstance = useSelector(({ verse }: RootState) => verse.view.scene.worldInstance)
  const VIEW_DIALOG_BOX = useSelector(({ verse }: RootState) => verse.view.viewDialogBox)
  const { isLoading: isQuerySceneBaseLoading, data: sceneBase } = useSceneQuery({ sid: sid as string })
  const currentPlacedAsset = sceneBase?.attributes?.assetList?.data?.find(
    assetData => assetData?.attributes.framePosition === VIEW_DIALOG_BOX.hoverObjectMetadata?.position
  )

  if (worldInstance) {
    if (VIEW_DIALOG_BOX.show) {
      worldInstance.setDialogMode(true)
    } else {
      worldInstance.setDialogMode(false)
    }
  }

  // ** Logics
  const handleViewDialogBoxClose = () => {
    if (worldInstance) {
      worldInstance.setDialogMode(false)
    }
    dispatch(hideViewDialogBox())
  }

  // ** Renders
  const renderNftBox = (ownNft: ISceneAsset) => {
    if (
      ownNft?.attributes?.coverFileType === 'png' ||
      ownNft?.attributes?.coverFileType === 'jpg' ||
      ownNft?.attributes?.coverFileType === 'svg' ||
      ownNft?.attributes?.coverFileType === 'gif'
    ) {
      return (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            maxWidth: theme => theme.spacing(80),
            maxHeight: theme => theme.spacing(80),
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '.2rem'
          }}
        >
          <img
            src={`${apiConfig.publicFolderUrl}${currentPlacedAsset?.attributes?.cover?.data?.attributes.url}`}
            alt={currentPlacedAsset?.attributes.displayName}
          />
        </Box>
      )
    }

    if (ownNft?.attributes?.coverFileType === 'mp4') {
      return (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            maxWidth: theme => theme.spacing(80),
            maxHeight: theme => theme.spacing(80),
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '.2rem',
            '& video': {
              objectFit: 'cover',
              borderRadius: '.2rem'
            }
          }}
        >
          <video
            width='100%'
            height='100%'
            src={`${apiConfig.publicFolderUrl}${currentPlacedAsset?.attributes?.cover?.data?.attributes.url}`}
            autoPlay
            loop
            muted
            playsInline
            crossOrigin='anonymous'
          />
        </Box>
      )
    }
  }

  return (
    <StyledRootDialog
      fullWidth
      maxWidth='md'
      scroll='paper'
      onClose={handleViewDialogBoxClose}
      open={VIEW_DIALOG_BOX.show}
    >
      {currentPlacedAsset ? (
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
              {currentPlacedAsset?.attributes.displayName}
            </Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={5}>
              {renderNftBox(currentPlacedAsset)}
            </Grid>
            <Grid item xs={12} sm={7}>
              <Grid container spacing={6}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CustomAvatar skin='light' variant='rounded' color='primary' sx={{ mr: 4 }}>
                      <Icon icon='mdi:account-outline' />
                    </CustomAvatar>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                        Owner
                      </Typography>
                      <Typography variant='caption'>
                        {currentPlacedAsset?.attributes?.owner?.data?.attributes.username}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CustomAvatar skin='light' variant='rounded' color='primary' sx={{ mr: 4 }}>
                      <Icon icon='mdi:account-outline' />
                    </CustomAvatar>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                        Owner
                      </Typography>
                      <Typography variant='caption'>
                        {currentPlacedAsset?.attributes?.owner?.data?.attributes.username}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='caption'>description</Typography>
                  <Typography variant='subtitle2'>
                    {currentPlacedAsset?.attributes?.description || 'no description'}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
      ) : (
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
              No Asset
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', textAlign: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <CustomAvatar skin='light' sx={{ width: 56, height: 56, mb: 2 }}>
              <Icon icon='mdi:help-circle-outline' fontSize='2rem' />
            </CustomAvatar>
            <Typography variant='h6' sx={{ mb: 2 }}>
              Support
            </Typography>
            <Typography variant='body2' sx={{ mb: 6.5 }}>
              According to us blisters are a very common thing and we come across them very often in our daily lives. It
              is a very common occurrence like cold or fever depending upon your lifestyle.
            </Typography>
          </Box>
        </DialogContent>
      )}

      <Backdrop
        open={isQuerySceneBaseLoading}
        sx={{
          position: 'absolute',
          color: 'common.white',
          zIndex: theme => theme.zIndex.mobileStepper - 1
        }}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
    </StyledRootDialog>
  )
}

export default ViewDialogBox
