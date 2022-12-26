// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// ** Components Imports
import TokenChainIcon from 'src/views/verse/components/view/viewDialogBox/assetDialogContent/TokenChainIcon'

// ** Config
import apiConfig from 'src/configs/api'

// ** Types
import { ISceneAsset } from 'src/types/sceneAssetTypes'

interface Props {
  ownNft: ISceneAsset
  currentPlacedAsset: ISceneAsset
}

const NftBox = (props: Props) => {
  // ** Props
  const { ownNft, currentPlacedAsset } = props

  if (
    ownNft?.attributes?.coverFileType === 'png' ||
    ownNft?.attributes?.coverFileType === 'jpg' ||
    ownNft?.attributes?.coverFileType === 'svg' ||
    ownNft?.attributes?.coverFileType === 'gif'
  ) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          maxWidth: theme => theme.spacing(80),
          maxHeight: theme => theme.spacing(80),
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '.2rem',
          '& img': {
            width: '100%',
            height: '100%',
            borderRadius: '.2rem'
          }
        }}
      >
        <img
          src={`${apiConfig.publicFolderUrl}${currentPlacedAsset?.attributes?.cover?.data?.attributes.url}`}
          alt={currentPlacedAsset?.attributes.displayName}
        />
        <Box sx={{ position: 'absolute', top: 0, p: 2, width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
          <Box
            sx={{
              p: theme => theme.spacing(1, 2),
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: theme => theme.palette.background.paper,
              borderRadius: theme => theme.shape.borderRadius
            }}
          >
            <TokenChainIcon chainName={ownNft?.attributes.tokenChain} />
            <Typography variant='subtitle2' sx={{ ml: 1 }}>
              {ownNft?.attributes.tokenChain}
            </Typography>
          </Box>
        </Box>
      </Box>
    )
  }

  if (ownNft?.attributes?.coverFileType === 'mp4') {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          maxWidth: theme => theme.spacing(220),
          maxHeight: theme => theme.spacing(140),
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '.2rem',
          '& video': {
            objectFit: 'cover',
            borderRadius: '.2rem'
          }
        }}
      >
        <video
          width='100%'
          height='100%'
          src={`${apiConfig.publicFolderUrl}${currentPlacedAsset?.attributes?.cover?.data?.attributes.url}`}
          autoPlay
          loop
          muted
          playsInline
          controls
          crossOrigin='anonymous'
        />
        <Box sx={{ position: 'absolute', top: 0, p: 2, width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
          <Box
            sx={{
              p: theme => theme.spacing(1, 2),
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: theme => theme.palette.background.paper,
              borderRadius: theme => theme.shape.borderRadius
            }}
          >
            <TokenChainIcon chainName={ownNft?.attributes.tokenChain} />
            <Typography variant='subtitle2' sx={{ ml: 1 }}>
              {ownNft?.attributes.tokenChain}
            </Typography>
          </Box>
        </Box>
      </Box>
    )
  }

  return null
}

export default NftBox
