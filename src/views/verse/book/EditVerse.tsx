// ** React Imports
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

// ** Mui Imports
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

// ** Book Imports
import { World as EditWorld } from 'src/views/verse/book/world/EditWorld'

// ** Custom Components Imports
import LoadingScreen from 'src/views/verse/components/edit/LoadingScreen'
import AppBarPanel from 'src/views/verse/components/edit/AppBarPanel'

import SettingPanel from 'src/views/verse/components/edit/SettingPanel'
import EditDialogBox from 'src/views/verse/components/edit/editDialogBox'
import HintBox from 'src/views/verse/components/edit/HintBox'
import MoveControlBox from 'src/views/verse/components/edit/MoveControlBox'

// ** Actions Imports
import { setWorldInstance } from 'src/store/verse/edit/sceneSlice'

// ** Styled RootBox component
const StyledRootBox = styled(Box)(() => ({
  width: '100%',
  height: '100%'
}))

const Book = () => {
  // ** Hooks
  const dispatch = useDispatch()

  useEffect(() => {
    const world = new EditWorld()

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
      <SettingPanel />
      <EditDialogBox />
      <HintBox />
      <MoveControlBox />
    </StyledRootBox>
  )
}

export default Book
