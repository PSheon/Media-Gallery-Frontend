// ** React Imports
import { useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Dialog, { DialogProps } from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Skeleton from '@mui/material/Skeleton'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Services Imports
import { useSceneQuery } from 'src/services/queries/scene.query'
import { useMeSceneAssetsQuery } from 'src/services/queries/sceneAsset.query'

// ** Utils Imports
import axios from 'axios'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

// ** Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Action Imports
import { hideEditDialogBox } from 'src/store/verse/edit/editDialogBoxSlice'

// ** Config
import apiConfig from 'src/configs/api'

// ** Types
import { AppDispatch, RootState } from 'src/store'
import { ISceneAsset } from 'src/types/sceneAssetTypes'

interface FormData {
  aid: number
  attributes: {
    framePosition: string | null
    scene: string | null
  }
}

// ** Styled StyledRootDialog component
const StyledRootDialog = styled(Dialog)<DialogProps>(({ theme }) => ({
  '& .MuiDialog-container': {
    display: 'flex',
    justifyContent: 'flex-start',
    paddingLeft: theme.spacing(6),
    [theme.breakpoints.down('sm')]: {
      paddingLeft: 0
    }
  }
}))

const CHAIN_LIST = [
  {
    id: 'eth',
    value: 'eth',
    icon: 'cryptocurrency-color:eth',
    displayName: 'Ethereum',
    supported: true
  },
  {
    id: 'polygon',
    value: 'polygon',
    icon: 'cryptocurrency-color:matic',
    displayName: 'Polygon',
    supported: true
  },
  {
    id: 'bsc',
    value: 'bsc',
    icon: 'cryptocurrency-color:bnb',
    displayName: 'BSC',
    supported: true
  },
  {
    id: 'avalanche',
    value: 'avalanche',
    icon: 'cryptocurrency-color:avax',
    displayName: 'Avalanche',
    supported: true
  }
]

const EditDialogBox = () => {
  // ** State
  const [addAssetsType, setAddAssetsType] = useState<string>('nft')
  const [chain, setChain] = useState<string>('eth')
  const [sceneAssetFilter, setSceneAssetFilter] = useState<string>('')

  // ** Hooks
  const router = useRouter()
  const { sid } = router.query
  const dispatch = useDispatch<AppDispatch>()
  const worldInstance = useSelector(({ verse }: RootState) => verse.edit.scene.worldInstance)
  const EDIT_DIALOG_BOX = useSelector(({ verse }: RootState) => verse.edit.editDialogBox)
  const queryClient = useQueryClient()
  const { isLoading: isQueryOwnNftListLoading, data: queryOwnNftListData } = useMeSceneAssetsQuery({ chain })
  const { isLoading: isQuerySceneBaseLoading, data: querySceneBaseData } = useSceneQuery({ sid: sid as string })
  const ownNftList =
    queryOwnNftListData?.data?.filter(ownNft =>
      ownNft?.attributes.displayName ? ownNft.attributes.displayName.includes(sceneAssetFilter) : true
    ) || []
  const sceneBase = querySceneBaseData?.data
  const { mutate: updateAssetFrame, isLoading: isUpdateAssetFrameLoading } = useMutation({
    mutationFn: ({ aid, attributes }: FormData) =>
      axios({
        method: 'PUT',
        url: `/api/scene-assets/${aid}`,
        params: {
          populate: {
            cover: true
          }
        },
        data: {
          data: attributes
        }
      }),
    onSuccess: response => {
      queryClient.invalidateQueries(['scene-assets'])
      queryClient.invalidateQueries(['scenes'])
      worldInstance?.updateAssetFrame(EDIT_DIALOG_BOX.hoverObjectMetadata!.position!, response.data.data as ISceneAsset)
      toast.success('Update asset success')
    },
    onError: () => {
      toast.error('Update asset failed')
    },
    retry: 0
  })
  const currentPlacedAsset = sceneBase?.attributes?.assetList?.data?.find(
    assetData => assetData?.attributes.framePosition === EDIT_DIALOG_BOX.hoverObjectMetadata?.position
  )

  // ** Logics
  const handleAddAssetsType = (newAddAssetsType: string) => {
    setAddAssetsType(newAddAssetsType)
  }
  const handleEditDialogBoxClose = () => {
    if (worldInstance) {
      worldInstance.setDialogMode(false)
    }
    dispatch(hideEditDialogBox())
  }
  const handleChangeChain = useCallback((e: SelectChangeEvent) => {
    setChain(e.target.value)
  }, [])
  const handleUpdateAssetFrameClick = (nftData: ISceneAsset) => {
    if (nftData?.attributes?.framePosition) return

    updateAssetFrame({
      aid: nftData.id,
      attributes: {
        framePosition: EDIT_DIALOG_BOX.hoverObjectMetadata.position!,
        scene: String(sid)
      }
    })
  }
  const handleDeleteAssetFrameClick = (nftData: ISceneAsset) => {
    updateAssetFrame({
      aid: nftData.id,
      attributes: {
        framePosition: null,
        scene: null
      }
    })
  }

  const renderNftBox = (ownNft: ISceneAsset) => {
    if (
      ownNft?.attributes?.coverFileType === 'png' ||
      ownNft?.attributes?.coverFileType === 'jpg' ||
      ownNft?.attributes?.coverFileType === 'svg' ||
      ownNft?.attributes?.coverFileType === 'gif'
    ) {
      return (
        <Box
          sx={{
            width: theme => theme.spacing(20),
            height: theme => theme.spacing(20),
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '.2rem'
          }}
        >
          <img
            src={`${apiConfig.publicFolderUrl}${currentPlacedAsset?.attributes?.cover?.data?.attributes.url}`}
            alt={currentPlacedAsset?.attributes.displayName}
          />
        </Box>
      )
    }

    if (ownNft?.attributes?.coverFileType === 'mp4') {
      return (
        <Box
          sx={{
            width: theme => theme.spacing(20),
            height: theme => theme.spacing(20),
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '.2rem',
            '& video': {
              objectFit: 'cover'
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
            crossOrigin='anonymous'
          />
        </Box>
      )
    }
  }

  const renderNftSelectBox = (ownNft: ISceneAsset) => {
    if (
      ownNft?.attributes?.coverFileType === 'png' ||
      ownNft?.attributes?.coverFileType === 'jpg' ||
      ownNft?.attributes?.coverFileType === 'svg' ||
      ownNft?.attributes?.coverFileType === 'gif'
    ) {
      return (
        <Box
          onClick={() => handleUpdateAssetFrameClick(ownNft)}
          sx={{
            width: '100%',
            height: theme => theme.spacing(40),
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '.2rem',
            cursor: ownNft?.attributes?.framePosition ? 'not-allowed' : 'pointer'
          }}
        >
          <img
            src={`${apiConfig.publicFolderUrl}${ownNft?.attributes?.cover?.data?.attributes.url}`}
            alt={ownNft?.attributes.displayName}
          />
          <Box sx={{ position: 'absolute', top: 0, p: 2, width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
            <Box
              sx={{
                px: 2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: theme => theme.palette.background.paper,
                borderRadius: theme => theme.shape.borderRadius
              }}
            >
              <Box
                sx={{
                  width: '8px',
                  height: '8px',
                  mr: 2,
                  backgroundColor: theme =>
                    ownNft?.attributes?.framePosition ? theme.palette.warning.main : theme.palette.success.main,
                  borderRadius: '50%'
                }}
              />
              <Typography variant='subtitle2'>
                {ownNft?.attributes?.framePosition ? 'placed' : ownNft.attributes.coverFileType!}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              p: 2,
              width: '100%',
              height: '80%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-end',
              background: `linear-gradient(to top, rgba(0, 0, 0, 0.89), rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1), transparent)`
            }}
          >
            <Typography variant='body2' color='common.white' noWrap>
              {ownNft?.attributes.displayName}
            </Typography>
          </Box>
        </Box>
      )
    }

    if (ownNft?.attributes?.coverFileType === 'mp4') {
      return (
        <Box
          onClick={() => handleUpdateAssetFrameClick(ownNft)}
          sx={{
            width: '100%',
            height: theme => theme.spacing(40),
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '.2rem',
            cursor: ownNft?.attributes?.framePosition ? 'not-allowed' : 'pointer',
            '& video': {
              objectFit: 'cover',
              borderRadius: '.2rem'
            }
          }}
        >
          <video
            width='100%'
            height='100%'
            src={`${apiConfig.publicFolderUrl}${ownNft?.attributes?.cover?.data?.attributes.url}`}
          />
          <Box sx={{ position: 'absolute', top: 0, p: 2, width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
            <Box
              sx={{
                px: 2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: theme => theme.palette.background.paper,
                borderRadius: theme => theme.shape.borderRadius
              }}
            >
              <Box
                sx={{
                  width: '8px',
                  height: '8px',
                  mr: 2,
                  backgroundColor: theme =>
                    ownNft?.attributes?.framePosition ? theme.palette.warning.main : theme.palette.success.main,
                  borderRadius: '50%'
                }}
              />
              <Typography variant='subtitle2'>
                {ownNft?.attributes?.framePosition ? 'placed' : ownNft.attributes.coverFileType!}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              p: 2,
              width: '100%',
              height: '80%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-end',
              background: `linear-gradient(to top, rgba(0, 0, 0, 0.89), rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1), transparent)`
            }}
          >
            <Typography variant='body2' color='common.white' noWrap>
              {ownNft?.attributes.displayName}
            </Typography>
          </Box>
        </Box>
      )
    }
  }

  return (
    <StyledRootDialog fullWidth maxWidth='xs' onClose={handleEditDialogBoxClose} open={EDIT_DIALOG_BOX.show}>
      {currentPlacedAsset ? (
        <DialogContent sx={{ backgroundColor: theme => theme.palette.action.hover }}>
          <IconButton
            size='small'
            onClick={handleEditDialogBoxClose}
            sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
          >
            <Icon icon='mdi:close-circle' fontSize={20} />
          </IconButton>
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography variant='h5'>Edit Asset</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={9}>
                  <Box
                    sx={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                      '& img': {
                        width: '100%',
                        objectFit: 'cover'
                      }
                    }}
                  >
                    {renderNftBox(currentPlacedAsset)}
                    <Box
                      sx={{
                        ml: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        borderRadius: '.2rem'
                      }}
                    >
                      <Typography sx={{ fontWeight: 600 }} noWrap>
                        {currentPlacedAsset?.attributes.displayName}
                      </Typography>
                      <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }} noWrap>
                        {currentPlacedAsset?.attributes.displayName || 'no description'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-end'
                    }}
                  >
                    <IconButton disabled>
                      <Icon icon='tabler:reload' />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteAssetFrameClick(currentPlacedAsset)}>
                      <Icon icon='material-symbols:delete-outline' />
                    </IconButton>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
          </Grid>
        </DialogContent>
      ) : (
        <DialogContent sx={{ backgroundColor: theme => theme.palette.action.hover }}>
          <IconButton
            size='small'
            onClick={handleEditDialogBoxClose}
            sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
          >
            <Icon icon='mdi:close-circle' fontSize={20} />
          </IconButton>
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography variant='h5'>Add Asset</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Button
                    fullWidth
                    size='small'
                    variant='contained'
                    onClick={() => handleAddAssetsType('nft')}
                    color={addAssetsType === 'nft' ? 'primary' : 'secondary'}
                    startIcon={<Icon icon='ph:image-square-fill' />}
                    sx={{
                      p: 4,
                      flex: 1,
                      borderRadius: 1
                    }}
                  >
                    NFT
                  </Button>
                </Grid>
                <Grid item xs={4}>
                  <Button
                    disabled
                    size='small'
                    fullWidth
                    variant='contained'
                    onClick={() => handleAddAssetsType('youtube')}
                    color={addAssetsType === 'youtube' ? 'primary' : 'secondary'}
                    startIcon={<Icon icon='mdi:youtube' />}
                    sx={{
                      p: 4,
                      flex: 1,
                      borderRadius: 1
                    }}
                  >
                    Youtube
                  </Button>
                </Grid>
                <Grid item xs={4}>
                  <Button
                    disabled
                    size='small'
                    fullWidth
                    variant='contained'
                    onClick={() => handleAddAssetsType('text')}
                    color={addAssetsType === 'text' ? 'primary' : 'secondary'}
                    startIcon={<Icon icon='material-symbols:text-fields-rounded' />}
                    sx={{
                      p: 4,
                      flex: 1,
                      borderRadius: 1
                    }}
                  >
                    Text
                  </Button>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12} sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  size='small'
                  value={sceneAssetFilter}
                  onChange={e => setSceneAssetFilter(e.target.value)}
                  placeholder='Search assets'
                  sx={{ maxWidth: '180px' }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Icon icon='material-symbols:search' fontSize={20} />
                      </InputAdornment>
                    )
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FormControl fullWidth size='small'>
                  <Select
                    fullWidth
                    value={chain}
                    id='select-chain'
                    onChange={handleChangeChain}
                    inputProps={{ placeholder: 'Select Chain' }}
                  >
                    {CHAIN_LIST.map(chainData => (
                      <MenuItem key={chainData.id} value={chainData.value}>
                        <Box
                          sx={{
                            pr: 4,
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            color: 'text.primary',
                            textDecoration: 'none',
                            '& svg': {
                              mr: 2,
                              fontSize: '1.375rem',
                              color: 'text.primary'
                            }
                          }}
                        >
                          <Icon icon={chainData.icon} />
                          {chainData.displayName}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2} sx={{ maxHeight: '30rem', overflowY: 'scroll' }}>
                {(isQueryOwnNftListLoading || isQuerySceneBaseLoading) &&
                  [...Array(6).keys()].map(aIndex => (
                    <Grid key={`scene-assets-skeleton-${aIndex}`} item xs={6}>
                      <Skeleton variant='rounded' height={125} />
                    </Grid>
                  ))}

                {ownNftList.length ? (
                  ownNftList.map(ownNft => (
                    <Grid key={ownNft.id} item xs={6}>
                      <Box
                        sx={{
                          display: 'flex',
                          borderRadius: 1,
                          cursor: 'pointer',
                          overflow: 'hidden',
                          position: 'relative',
                          alignItems: 'center',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          border: theme => `2px solid ${theme.palette.divider}`,
                          '&:hover': {
                            borderColor: theme => `rgba(${theme.palette.customColors.main}, 0.25)`
                          },
                          '& img': {
                            width: '100%',
                            objectFit: 'cover'
                          }
                        }}
                      >
                        {ownNft?.attributes.fetchStatus === 'fetching' && (
                          <Box
                            sx={{
                              height: theme => theme.spacing(40),
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderRadius: '.2rem'
                            }}
                          >
                            <Icon icon='eos-icons:loading' fontSize={24} />
                            <Box sx={{ position: 'absolute', bottom: 0 }}>
                              <Typography variant='caption'>Fetching...</Typography>
                            </Box>
                          </Box>
                        )}
                        {ownNft?.attributes.fetchStatus === 'failed' && (
                          <Box
                            sx={{
                              height: theme => theme.spacing(40),
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderRadius: '.2rem'
                            }}
                          >
                            <Icon icon='material-symbols:question-mark-rounded' fontSize={24} />
                            <Box
                              sx={{
                                position: 'absolute',
                                bottom: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                              }}
                            >
                              <Typography variant='caption'>{ownNft?.attributes.displayName}</Typography>
                              <Typography variant='caption'>Fetch failed</Typography>
                            </Box>
                          </Box>
                        )}
                        {ownNft?.attributes.fetchStatus === 'fetched' && renderNftSelectBox(ownNft)}
                      </Box>
                    </Grid>
                  ))
                ) : (
                  <Grid
                    item
                    xs={12}
                    sx={{ display: 'flex', textAlign: 'center', alignItems: 'center', flexDirection: 'column' }}
                  >
                    <CustomAvatar skin='light' sx={{ width: 56, height: 56, mb: 2 }}>
                      <Icon icon='mdi:help-circle-outline' fontSize='2rem' />
                    </CustomAvatar>
                    <Typography variant='h6' sx={{ mb: 2 }}>
                      No Result
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
      )}

      <Backdrop
        open={isUpdateAssetFrameLoading}
        sx={{
          position: 'absolute',
          color: 'common.white',
          zIndex: theme => theme.zIndex.mobileStepper - 1
        }}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
    </StyledRootDialog>
  )
}

export default EditDialogBox
