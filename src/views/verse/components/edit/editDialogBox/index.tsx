// ** React Imports
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// ** Next Import
import Image from 'next/image'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import TextField from '@mui/material/TextField'
import Skeleton from '@mui/material/Skeleton'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Utils Imports
import axios from 'axios'
import { useQuery, useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

// ** Action Imports
import { hideEditDialogBox } from 'src/store/verse/edit/editDialogBoxSlice'

// ** Config
import apiConfig from 'src/configs/api'

// ** Types
import { AppDispatch, RootState } from 'src/store'
import { IAsset } from 'src/types/scene/assetTypes'

const EditDialogBox = () => {
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const worldInstance = useSelector(({ verse }: RootState) => verse.edit.scene.worldInstance)
  const EDIT_DIALOG_BOX = useSelector(({ verse }: RootState) => verse.edit.editDialogBox)
  const {
    isLoading: isQueryLoading,
    data: ownNftList = [],
    refetch
  } = useQuery({
    queryKey: ['own-nft-list'],
    queryFn: () =>
      axios({
        method: 'GET',
        url: `/api/own-nft-list`,
        params: {
          populate: ['cover']
        }
      }).then(response => response.data.data as IAsset[]),
    retry: 0
  })

  // ** State
  const [addAssetsType, setAddAssetsType] = useState<string>('nft')

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

  const renderNft = (ownNft: IAsset) => {
    if (
      ownNft?.attributes?.coverFileType === 'png' ||
      ownNft?.attributes?.coverFileType === 'gif' ||
      ownNft?.attributes?.coverFileType === 'jpg'
    ) {
      return (
        <Box
          sx={{
            height: theme => theme.spacing(40),
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '.2rem'
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
                  backgroundColor: theme => theme.palette.success.main,
                  borderRadius: '50%'
                }}
              />
              <Typography variant='subtitle2'>{ownNft.attributes.coverFileType!}</Typography>
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
            <Typography variant='caption'>{ownNft?.attributes.displayName}</Typography>
          </Box>
        </Box>
      )
    }

    if (ownNft?.attributes?.coverFileType === 'mp4') {
      return (
        <Box
          sx={{
            height: theme => theme.spacing(40),
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '.2rem'
          }}
        >
          <video
            width='100%'
            height='auto'
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
                  backgroundColor: theme => theme.palette.success.main,
                  borderRadius: '50%'
                }}
              />
              <Typography variant='subtitle2'>{ownNft.attributes.coverFileType!}</Typography>
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
            <Typography variant='caption'>{ownNft?.attributes.displayName}</Typography>
          </Box>
        </Box>
      )
    }
  }

  return (
    <Dialog fullWidth maxWidth='sm' onClose={handleEditDialogBoxClose} open={EDIT_DIALOG_BOX.show}>
      <DialogContent sx={{ backgroundColor: theme => theme.palette.action.hover }}>
        <IconButton
          size='small'
          onClick={handleEditDialogBoxClose}
          sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
        >
          <Icon icon='mdi:close-circle' fontSize={20} />
        </IconButton>
        <Box sx={{ mb: 8, textAlign: 'center' }}>
          <Typography variant='h5' sx={{ mb: 3 }}>
            Add Asset
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Button
                  fullWidth
                  variant='contained'
                  onClick={() => {
                    // NOTE
                    refetch()
                    handleAddAssetsType('nft')
                  }}
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

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField
                size='small'
                value=''
                placeholder='Search assets'
                sx={{ mr: 4, mb: 2, maxWidth: '180px' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Icon icon='material-symbols:search' fontSize={20} />
                    </InputAdornment>
                  )
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={2}>
              {isQueryLoading &&
                [...Array(6).keys()].map(aIndex => (
                  <Grid key={`scene-assets-skeleton-${aIndex}`} item xs={6} sm={4}>
                    <Skeleton variant='rounded' height={125} />
                  </Grid>
                ))}

              {ownNftList.map(ownNft => {
                return (
                  <Grid key={ownNft.id} item xs={4}>
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
                      {ownNft?.attributes.fetchStatus === 'fetched' && renderNft(ownNft)}
                    </Box>
                  </Grid>
                )
              })}
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}

export default EditDialogBox
