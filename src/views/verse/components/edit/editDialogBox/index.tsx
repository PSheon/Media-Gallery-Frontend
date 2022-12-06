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

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Utils Imports
import axios from 'axios'
import { useQuery, useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

// ** Action Imports
import { hideEditDialogBox } from 'src/store/verse/edit/editDialogBoxSlice'

// ** Types
import { AppDispatch, RootState } from 'src/store'

const EditDialogBox = () => {
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const EDIT_DIALOG_BOX = useSelector(({ verse }: RootState) => verse.edit.editDialogBox)
  const {
    isLoading: isQueryLoading,
    data: ownNftList,
    refetch
  } = useQuery({
    queryKey: ['own-nft-list'],
    queryFn: () =>
      axios({
        method: 'GET',
        url: `/api/own-nft-image`
      }).then(response => response.data),
    retry: 0
  })
  console.log('ownNftList, ', ownNftList)

  // ** State
  const [addAssetsType, setAddAssetsType] = useState<string>('nft')

  // ** Logics
  const handleAddAssetsType = (newAddAssetsType: string) => {
    setAddAssetsType(newAddAssetsType)
  }
  const handleEditDialogBoxClose = () => {
    dispatch(hideEditDialogBox())
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
              <Grid item xs={4}>
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    borderRadius: 1,
                    cursor: 'pointer',
                    overflow: 'hidden',
                    position: 'relative',
                    alignItems: 'center',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    border: theme => `2px solid ${theme.palette.divider}`,
                    ...(false
                      ? { borderColor: `primary.main` }
                      : { '&:hover': { borderColor: theme => `rgba(${theme.palette.customColors.main}, 0.25)` } }),
                    '& img': {
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }
                  }}
                >
                  <Image width={140} height={140} src='/images/pages/background-3.jpg' alt='something' />
                </Box>
              </Grid>

              <Grid item xs={4}>
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    borderRadius: 1,
                    cursor: 'pointer',
                    overflow: 'hidden',
                    position: 'relative',
                    alignItems: 'center',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    border: theme => `2px solid ${theme.palette.divider}`,
                    ...(false
                      ? { borderColor: `primary.main` }
                      : { '&:hover': { borderColor: theme => `rgba(${theme.palette.customColors.main}, 0.25)` } }),
                    '& img': {
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }
                  }}
                >
                  <Image width={140} height={140} src='/images/pages/background-3.jpg' alt='something' />
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}

export default EditDialogBox
