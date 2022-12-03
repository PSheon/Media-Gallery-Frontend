// ** React Imports
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// ** MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { Theme } from '@mui/material/styles'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'

// ** Actions Imports
import { showEditDialogBox } from 'src/store/verse/edit/editDialogBoxSlice'

// ** Types
import { RootState } from 'src/store'

// ** Styled RootBox component
const RootBox = styled(Box)(({ theme }) => ({
  position: 'fixed',
  margin: theme.spacing(2),
  right: theme.spacing(2),
  bottom: theme.spacing(32),
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
  const LOADING_SCREEN_SHOW = useSelector(({ verse }: RootState) => verse.edit.uiLayout.loadingScreenShow)
  const EDIT_DIALOG_BOX = useSelector(({ verse }: RootState) => verse.edit.editDialogBox)
  const SCENE_NFT_LIST = useSelector(({ verse }: RootState) => verse.edit.scene.nftList)
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))

  // ** States
  const [frameDisplayName, setFrameDisplayName] = useState('Fetching...')
  const [frameDescription, setFrameDescription] = useState('')

  // ** Logics
  const handleClick = () => {
    dispatch(showEditDialogBox())
  }

  // ** Side Effect
  // useEffect(() => {
  //   const nftDetail = SCENE_NFT_LIST.find(nftDetail => nftDetail.frameId === EDIT_DIALOG_BOX.speaker)
  //   if (nftDetail) {
  //     setFrameDisplayName(nftDetail.displayName)
  //     setFrameDescription(nftDetail.description)
  //   } else {
  //     setFrameDisplayName(EDIT_DIALOG_BOX.speaker)
  //     setFrameDescription('')
  //   }
  // }, [SCENE_NFT_LIST, EDIT_DIALOG_BOX.speaker])

  return (
    <RootBox
      style={{ display: !LOADING_SCREEN_SHOW && !EDIT_DIALOG_BOX.show && EDIT_DIALOG_BOX.hover ? 'block' : 'none' }}
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
