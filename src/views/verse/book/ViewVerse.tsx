// ** React Imports
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

// ** Mui Imports
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

// ** Book Imports
import { World } from 'src/views/verse/book/world/World'

// ** Custom Components Imports
import LoadingScreen from 'src/views/verse/components/view/LoadingScreen'
import AppBarPanel from 'src/views/verse/components/view/AppBarPanel'
import StartPanel from 'src/views/verse/components/view/StartPanel'
import SettingPanel from 'src/views/verse/components/view/SettingPanel'
import ViewDialogBox from 'src/views/verse/components/view/viewDialogBox'
import HintBox from 'src/views/verse/components/view/HintBox'
import MoveControlBox from 'src/views/verse/components/view/MoveControlBox'

// ** Actions Imports
import { setWorldInstance } from 'src/store/verse/view/sceneSlice'

// ** Styled RootBox component
const StyledRootBox = styled(Box)(() => ({
  width: '100%',
  height: '100%'
}))

const Book = () => {
  // ** Hooks
  const dispatch = useDispatch()

  useEffect(() => {
    const world = new World()

    dispatch(setWorldInstance(world))

    return () => {
      world.destroy()
    }
  }, [dispatch])

  return (
    <StyledRootBox id='world'>
      <Box id='ui-container' sx={{ position: 'absolute', top: 0, height: '100%' }} />
      {/* Loading */}
      <LoadingScreen />

      {/* Main Layout */}
      <AppBarPanel />
      <StartPanel />
      <SettingPanel />
      <ViewDialogBox />
      <HintBox />
      <MoveControlBox />
    </StyledRootBox>
  )
}

export default Book
