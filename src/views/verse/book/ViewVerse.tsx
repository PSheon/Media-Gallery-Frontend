// ** React Imports
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

// ** Mui Imports
import { styled } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'

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

// ** Types
import { IScene } from 'src/types/sceneTypes'

interface Props {
  sceneBase: IScene
  playerDisplayName: string
  playerAvatarURL: string
}

// ** Styled RootBox component
const StyledRootBox = styled(Box)<BoxProps>(() => ({
  width: '100%',
  height: '100%'
}))

const Book = (props: Props) => {
  // ** Props
  const { sceneBase, playerDisplayName, playerAvatarURL } = props

  // ** Hooks
  const dispatch = useDispatch()

  useEffect(() => {
    const world = new World({
      sceneId: sceneBase.id,
      owner: sceneBase?.attributes?.owner?.data?.attributes?.username || 'Anonymous',
      displayName: sceneBase?.attributes?.displayName || 'Untitled',
      description: sceneBase?.attributes?.description || 'no description',
      worldScenePaths: sceneBase?.attributes.sceneModel.data?.attributes.worldScenePaths || [],
      assetList: sceneBase?.attributes.assetList?.data || [],
      playerDisplayName,
      playerAvatarURL
    })

    dispatch(setWorldInstance(world))

    return () => {
      world.destroy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
