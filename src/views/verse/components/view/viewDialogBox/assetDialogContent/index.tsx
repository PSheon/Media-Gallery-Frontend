// ** React Imports
import { Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// ** Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import NftBox from 'src/views/verse/components/view/viewDialogBox/assetDialogContent/NftBox'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Utils
import { etherAddressFormatter } from 'src/utils/ether-address'

// ** Types
import { ISceneAsset } from 'src/types/sceneAssetTypes'

interface Props {
  handleViewDialogBoxClose: () => void
  currentPlacedAsset?: ISceneAsset
  isQuerySceneBaseLoading: boolean
}

const AssetDialogContent = (props: Props) => {
  // ** Props
  const { handleViewDialogBoxClose, currentPlacedAsset, isQuerySceneBaseLoading } = props

  return (
    <Fragment>
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
              {currentPlacedAsset.attributes.displayName}
            </Typography>
          </Box>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={5}>
              <NftBox ownNft={currentPlacedAsset} currentPlacedAsset={currentPlacedAsset} />
            </Grid>
            <Grid item xs={12} sm={7}>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CustomAvatar skin='light' variant='rounded' color='primary' sx={{ mr: 4 }}>
                      <Icon icon='mdi:account-outline' />
                    </CustomAvatar>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant='subtitle1' sx={{ fontWeight: 600 }} noWrap>
                        {currentPlacedAsset.attributes?.owner?.data?.attributes.username}
                      </Typography>
                      <Typography variant='caption'>Owner</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CustomAvatar skin='light' variant='rounded' color='secondary' sx={{ mr: 4 }}>
                      <Icon icon='uil:file-contract' />
                    </CustomAvatar>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant='subtitle1' sx={{ fontWeight: 600 }} noWrap>
                        {etherAddressFormatter(currentPlacedAsset.attributes?.tokenContract || '')}
                      </Typography>
                      <Typography variant='caption'>Contract</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='caption'>description</Typography>
                  <Typography variant='subtitle2'>
                    {currentPlacedAsset.attributes?.description || 'no description'}
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
              No Asset Placed
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
              {'Go Dashboard > scene > edit'}
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
    </Fragment>
  )
}

export default AssetDialogContent
