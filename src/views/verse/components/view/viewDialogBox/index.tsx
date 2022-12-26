// ** React Imports
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import { styled } from '@mui/material/styles'
import Dialog, { DialogProps } from '@mui/material/Dialog'

// ** Services Imports
import { useSceneQuery } from 'src/services/queries/scene.query'

// ** Actions Imports
import { hideViewDialogBox } from 'src/store/verse/view/viewDialogBoxSlice'

// ** Components Imports
import AssetDialogContent from 'src/views/verse/components/view/viewDialogBox/assetDialogContent'
import NpcDialogContent from 'src/views/verse/components/view/viewDialogBox/npcDialogContent'

// ** Utils
import axios from 'axios'

// ** Types
import { RootState } from 'src/store'

// ** Styled StyledRootDialog component
const StyledRootDialog = styled(Dialog)<DialogProps>(() => ({
  '& .MuiDialog-container': {
    display: 'flex',
    flexDirection: 'column'
  }
}))

const ViewDialogBox = () => {
  // ** Hooks
  const router = useRouter()
  const { sid } = router.query
  const dispatch = useDispatch()
  const worldInstance = useSelector(({ verse }: RootState) => verse.view.scene.worldInstance)
  const VIEW_DIALOG_BOX = useSelector(({ verse }: RootState) => verse.view.viewDialogBox)
  const { isLoading: isQuerySceneBaseLoading, data: queryData } = useSceneQuery({ sid: sid as string })
  const sceneBase = queryData?.data
  const currentPlacedAsset = sceneBase?.attributes?.assetList?.data?.find(
    assetData => assetData?.attributes.framePosition === VIEW_DIALOG_BOX.hoverObjectMetadata?.framePosition
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

  // ** Side Effect
  useEffect(() => {
    try {
      if (VIEW_DIALOG_BOX.show) {
        axios({
          method: 'POST',
          url: `/api/scene-assets/view/${currentPlacedAsset!.id}`
        })
      }
    } catch (viewAssetErr) {
      console.error('View asset err, ', viewAssetErr)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [VIEW_DIALOG_BOX.show])

  return (
    <StyledRootDialog
      fullWidth
      maxWidth='md'
      scroll='paper'
      onClose={handleViewDialogBoxClose}
      open={VIEW_DIALOG_BOX.show}
    >
      {VIEW_DIALOG_BOX.hoverObjectType === 'npc' && (
        <NpcDialogContent
          handleViewDialogBoxClose={handleViewDialogBoxClose}
          npcMetadata={VIEW_DIALOG_BOX.hoverObjectMetadata!}
        />
      )}
      {VIEW_DIALOG_BOX.hoverObjectType === 'asset' && (
        <AssetDialogContent
          handleViewDialogBoxClose={handleViewDialogBoxClose}
          currentPlacedAsset={currentPlacedAsset}
          isQuerySceneBaseLoading={isQuerySceneBaseLoading}
        />
      )}
    </StyledRootDialog>
  )
}

export default ViewDialogBox
