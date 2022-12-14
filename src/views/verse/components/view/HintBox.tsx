// ** React Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { Theme } from '@mui/material/styles'
import { styled } from '@mui/material/styles'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import Box, { BoxProps } from '@mui/material/Box'
import Card, { CardProps } from '@mui/material/Card'
import Typography from '@mui/material/Typography'

// ** Services Imports
import { useSceneQuery } from 'src/services/queries/scene.query'

// ** Actions Imports
import { showViewDialogBox } from 'src/store/verse/view/viewDialogBoxSlice'

// ** Types
import { RootState } from 'src/store'

// ** Styled RootBox component
const RootBox = styled(Box)<BoxProps>(({ theme }) => ({
  position: 'fixed',
  margin: theme.spacing(2),
  backgroundColor: 'transparent',
  cursor: 'pointer'
}))

// ** Styled PanelCard component
const PanelCard = styled(Card)<CardProps>(({ theme }) => ({
  width: 'fit-content',
  minWidth: '10rem',
  padding: theme.spacing(1, 3),
  backgroundColor: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.8)',
  transition: theme.transitions.create('background-color'),

  '&:hover': {
    backgroundColor: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.95)'
  }
}))

const HintBox = () => {
  // ** Hooks
  const router = useRouter()
  const { sid } = router.query
  const dispatch = useDispatch()
  const worldInstance = useSelector(({ verse }: RootState) => verse.view.scene.worldInstance)
  const LOADING_SCREEN_SHOW = useSelector(({ verse }: RootState) => verse.view.uiLayout.loadingScreenShow)
  const VIEW_DIALOG_BOX = useSelector(({ verse }: RootState) => verse.view.viewDialogBox)
  const { isLoading: isQueryLoading, data: sceneBase } = useSceneQuery({ sid: sid as string })
  const currentPlacedAsset = sceneBase?.attributes?.assetList?.data?.find(
    assetData => assetData?.attributes.framePosition === VIEW_DIALOG_BOX.hoverObjectMetadata?.position
  )
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))

  // ** Logics
  const handleClick = () => {
    if (worldInstance) {
      worldInstance.setDialogMode(true)
    }
    dispatch(showViewDialogBox())
  }

  return (
    <RootBox
      sx={{
        left: isDesktop ? 'inherit' : '50%',
        right: theme => (isDesktop ? theme.spacing(2) : 'inherit'),
        bottom: theme => (isDesktop ? theme.spacing(24) : theme.spacing(16)),
        transform: isDesktop ? 'inherit' : 'translateX(-50%)'
      }}
      style={{ display: !LOADING_SCREEN_SHOW && !VIEW_DIALOG_BOX.show && VIEW_DIALOG_BOX.hover ? 'block' : 'none' }}
    >
      <PanelCard onClick={handleClick} sx={{ position: 'relative' }}>
        <Typography variant='subtitle1'>
          {currentPlacedAsset?.attributes?.displayName || VIEW_DIALOG_BOX.hoverObjectMetadata?.displayName}
        </Typography>
        {currentPlacedAsset?.attributes?.description && (
          <Typography variant='subtitle2'>{currentPlacedAsset.attributes.description}</Typography>
        )}
        <Typography component='sup' variant='caption'>
          {isDesktop ? `Press "E"` : 'Click for more detail'}
        </Typography>

        <Backdrop
          open={isQueryLoading}
          sx={{
            position: 'absolute',
            color: 'common.white',
            backgroundColor: theme =>
              theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)',
            zIndex: theme => theme.zIndex.mobileStepper - 1
          }}
        >
          <CircularProgress color='inherit' />
        </Backdrop>
      </PanelCard>
    </RootBox>
  )
}

export default HintBox
