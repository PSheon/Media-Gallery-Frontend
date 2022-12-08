// ** React Imports
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// ** MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { Theme } from '@mui/material/styles'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'

// ** Actions Imports
import { showViewDialogBox } from 'src/store/verse/view/viewDialogBoxSlice'

// ** Types
import { RootState } from 'src/store'

// ** Styled RootBox component
const RootBox = styled(Box)(({ theme }) => ({
  position: 'fixed',
  margin: theme.spacing(2),
  backgroundColor: 'transparent',
  cursor: 'pointer'
}))

// ** Styled PanelCard component
const PanelCard = styled(Card)(({ theme }) => ({
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
  const dispatch = useDispatch()
  const LOADING_SCREEN_SHOW = useSelector(({ verse }: RootState) => verse.view.uiLayout.loadingScreenShow)
  const VIEW_DIALOG_BOX = useSelector(({ verse }: RootState) => verse.view.viewDialogBox)

  // const SCENE_NFT_LIST = useSelector(({ verse }: RootState) => verse.view.scene.nftList)
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))

  // ** States
  // eslint-disable-next-line
  const [frameDisplayName, setFrameDisplayName] = useState('Fetching...')
  // eslint-disable-next-line
  const [frameDescription, setFrameDescription] = useState('')

  // ** Logics
  const handleClick = () => {
    dispatch(showViewDialogBox())
  }

  // ** Side Effect
  // useEffect(() => {
  //   const nftDetail = SCENE_NFT_LIST.find(nftDetail => nftDetail.frameId === VIEW_DIALOG_BOX.speaker)
  //   if (nftDetail) {
  //     setFrameDisplayName(nftDetail.displayName)
  //     setFrameDescription(nftDetail.description)
  //   } else {
  //     setFrameDisplayName(VIEW_DIALOG_BOX.speaker)
  //     setFrameDescription('')
  //   }
  // }, [SCENE_NFT_LIST, VIEW_DIALOG_BOX.speaker])

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
      <PanelCard onClick={handleClick}>
        <Typography variant='subtitle1'>{frameDisplayName}</Typography>
        {frameDescription && <Typography variant='subtitle2'>{frameDescription}</Typography>}
        <Typography component='sup' variant='caption'>
          {isDesktop ? `Press "E"` : 'Click for more detail'}
        </Typography>
      </PanelCard>
    </RootBox>
  )
}

export default HintBox
