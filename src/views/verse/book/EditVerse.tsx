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

// ** Types
import { IScene } from 'src/types/scene/sceneTypes'

interface Props {
  sceneBase: IScene
}

// ** Styled RootBox component
const StyledRootBox = styled(Box)(() => ({
  width: '100%',
  height: '100%'
}))

const Book = (props: Props) => {
  // ** Props
  const { sceneBase } = props

  // ** Hooks
  const dispatch = useDispatch()

  useEffect(() => {
    const world = new EditWorld({
      owner: sceneBase?.attributes?.owner?.data?.attributes?.username || 'Anonymous',
      displayName: sceneBase?.attributes?.displayName || 'Untitled',
      description: sceneBase?.attributes?.description || 'Nope',
      worldScenePaths: sceneBase?.attributes.sceneModel.data?.attributes.worldScenePaths || [],
      assetList: sceneBase?.attributes.assetList?.data || [],

      // nftList: sceneBase?.attributes?.assetList?.data || []
      nftList: []
    })

    dispatch(setWorldInstance(world))

    return () => {
      world.destroy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
