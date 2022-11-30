// ** React Imports
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

// ** Mui Imports
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

// ** Book Imports
import { World } from './world/World'

// ** Custom Components Imports
// import LoadingScreen from './components/LoadingScreen'
// import AppBarPanel from './components/AppBarPanel'
// import SocialPanel from './components/SocialPanel'
// import StartPanel from './components/StartPanel'
// import SettingPanel from './components/SettingPanel'
// import DialogBox from './components/DialogBox'
// import MoveControlBox from './components/MoveControlBox'
// import HintBox from './components/HintBox'

// Styled RootBox component
const StyledRootBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%'
}))

const Book = () => {
  // ** Hooks
  const dispatch = useDispatch()

  useEffect(() => {
    const world = new World('/assets/book/world.glb')
  }, [dispatch])

  return (
    <StyledRootBox id='world'>
      <Box id='ui-container' />
      {/* <LoadingScreen /> */}

      {/* App Bar */}
      {/* <AppBarPanel />

      <StartPanel />
      <SocialPanel />
      <SettingPanel />
      <DialogBox />
      <MoveControlBox />
      <HintBox /> */}
    </StyledRootBox>
  )
}

export default Book
