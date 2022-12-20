// ** React Imports
import { useState, Fragment } from 'react'

// ** Redux Imports
import { useSelector } from 'react-redux'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import { styled } from '@mui/material/styles'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import LoadingButton from '@mui/lab/LoadingButton'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import TextField from '@mui/material/TextField'

// ** Utils Imports
import axios from 'axios'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useFileUpload } from 'use-file-upload'

// ** Services Imports
import { useSceneQuery } from 'src/services/queries/scene.query'

// ** React Hook Form Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Components Imports
import SceneCard from 'src/views/verse/components/edit/settingPanel/leftSection/SceneCard'

// ** Config
import apiConfig from 'src/configs/api'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { RootState } from 'src/store'

// ** Styled Preview Picture
const PreviewPicture = styled('img')(({ theme }) => ({
  width: theme.spacing(50),
  height: theme.spacing(25),
  objectFit: 'cover',
  borderRadius: theme.shape.borderRadius,
  border: `5px solid ${theme.palette.common.white}`,
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4)
  }
}))

const schema = yup.object().shape({
  sceneId: yup.string().min(3).max(36).required(),
  displayName: yup.string().optional(),
  description: yup.string().optional()
})

interface UpdateSceneFormData {
  sceneId?: string
  displayName?: string
  description?: string
}

const SceneProfile = () => {
  // ** Hooks
  const router = useRouter()
  const { sid } = router.query
  // eslint-disable-next-line
  const [files, selectFiles] = useFileUpload()
  const worldInstance = useSelector(({ verse }: RootState) => verse.edit.scene.worldInstance)
  const queryClient = useQueryClient()
  const { isLoading: isQueryLoading, data: queryData } = useSceneQuery({ sid: sid as string })
  const sceneBase = queryData?.data
  const { mutate: updateScene, isLoading: isUpdateSceneLoading } = useMutation({
    mutationFn: (newSceneData: UpdateSceneFormData) =>
      axios({
        method: 'PUT',
        url: `/api/scenes/${sid}`,
        data: {
          data: newSceneData
        }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['scenes'])

      toast.success('Update scene success')
    },
    onError: () => {
      // setError('username', {
      //   type: 'manual',
      //   message: 'Username is invalid'
      // })
      toast.error('Update scene failed')
    }
  })
  const { mutate: updateSceneCover, isLoading: isUpdateSceneCoverLoading } = useMutation({
    mutationFn: async (newCoverFormData: FormData) => {
      const { data: coverData } = await axios({
        method: 'post',
        url: '/api/upload',
        data: newCoverFormData
      })
      const newCoverId = coverData?.[0].id

      return axios({
        method: 'PUT',
        url: `/api/scenes/${sid}`,
        data: {
          data: {
            cover: newCoverId
          }
        }
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['scenes'])

      toast.success('Update scene cover success')
    },
    onError: () => {
      // setError('username', {
      //   type: 'manual',
      //   message: 'Username is invalid'
      // })
      toast.error('Update scene cover failed')
    }
  })
  const {
    control,

    // setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      displayName: sceneBase?.attributes?.displayName || '',
      sceneId: sceneBase?.attributes.sceneId,
      description: sceneBase?.attributes?.description || ''
    },
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  // ** States
  const [SceneEditPanelOpen, setSceneEditPanelOpen] = useState(false)

  // ** Logics
  const handleSceneEditPanelOpen = () => {
    setSceneEditPanelOpen(true)
    if (worldInstance) {
      worldInstance.setDialogMode(true)
    }
  }
  const handleSceneEditPanelClose = () => {
    setSceneEditPanelOpen(false)
    if (worldInstance) {
      worldInstance.setDialogMode(false)
    }
  }
  const handleChangeCoverPhoto = () => {
    // @ts-ignore
    selectFiles({ accept: 'image/*', multiple: false }, async ({ file }) => {
      const updateSceneCoverFormData = new FormData()
      updateSceneCoverFormData.append('files', file)
      updateSceneCover(updateSceneCoverFormData)
    })
  }
  const onSubmit = (newData: UpdateSceneFormData) => {
    updateScene(newData)
  }

  return (
    <Fragment>
      <Box onClick={handleSceneEditPanelOpen} sx={{ position: 'relative' }}>
        <SceneCard sceneBase={sceneBase!} />

        <Backdrop
          open={isQueryLoading}
          sx={{
            position: 'absolute',
            color: 'common.white',
            backgroundColor: theme =>
              theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)',
            zIndex: theme => theme.zIndex.mobileStepper - 1
          }}
        >
          <CircularProgress color='inherit' />
        </Backdrop>
      </Box>

      <Dialog fullWidth maxWidth='sm' onClose={handleSceneEditPanelClose} open={SceneEditPanelOpen}>
        <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ backgroundColor: theme => theme.palette.action.hover }}>
            <IconButton
              size='small'
              onClick={handleSceneEditPanelClose}
              sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
            >
              <Icon icon='mdi:close-circle' fontSize={20} />
            </IconButton>
            <Box sx={{ mb: 8, textAlign: 'center' }}>
              <Typography variant='h5' sx={{ mb: 3 }}>
                Edit Scene
              </Typography>
              <Typography variant='body2'>
                Fill a displayName to make it public. Regenerate its previews (bottom) to update its thumbnail and
                portal appearance.
              </Typography>
            </Box>

            <Grid container spacing={4} justifyContent='center'>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Typography variant='subtitle2' sx={{ mb: 2 }}>
                    Preview
                  </Typography>
                  <Box
                    onClick={handleChangeCoverPhoto}
                    sx={{
                      position: 'relative',
                      width: 'fit-content',
                      minWidth: '10rem',
                      height: '6rem',
                      mb: 4,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '.2rem',
                      cursor: 'pointer',
                      border: theme => `1px dashed ${theme.palette.divider}`,
                      '&:hover': { borderColor: theme => `rgba(${theme.palette.customColors.main}, 0.25)` }
                    }}
                  >
                    {sceneBase?.attributes?.cover?.data?.attributes?.url ? (
                      <PreviewPicture
                        src={`${apiConfig.publicFolderUrl}${sceneBase.attributes.cover.data.attributes.url}`}
                        alt={sceneBase?.attributes.owner?.data?.attributes?.username}
                      />
                    ) : (
                      <Icon icon='material-symbols:add' fontSize={24} />
                    )}

                    <Backdrop
                      open={isQueryLoading || isUpdateSceneCoverLoading}
                      sx={{
                        position: 'absolute',
                        color: 'common.white',
                        backgroundColor: theme => theme.palette.background.default,
                        border: theme => `1px dashed ${theme.palette.divider}`,
                        zIndex: theme => theme.zIndex.mobileStepper - 1
                      }}
                    >
                      <CircularProgress color='inherit' />
                    </Backdrop>
                  </Box>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Typography variant='subtitle2' sx={{ mb: 2 }}>
                    Scene ID
                  </Typography>
                  <Controller
                    name='sceneId'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField
                        value={value}
                        onBlur={onBlur}
                        onChange={e =>
                          onChange(
                            e.target.value
                              .replace(/[^a-zA-Z- ]/gm, '')
                              .replace(' ', '-')
                              .toLocaleLowerCase()
                          )
                        }
                        error={Boolean(errors.sceneId)}
                        placeholder={sceneBase?.attributes?.sceneId}
                        InputProps={{
                          startAdornment: <InputAdornment position='start'>media.app/@</InputAdornment>
                        }}
                      />
                    )}
                  />
                  {errors.sceneId && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.sceneId.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Typography variant='subtitle2' sx={{ mb: 2 }}>
                    Display Name
                  </Typography>
                  <Controller
                    name='displayName'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        error={Boolean(errors.displayName)}
                        placeholder='Untitled'
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <Box
                                sx={{
                                  px: 2,
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center'
                                }}
                              >
                                <Box
                                  sx={{
                                    width: '8px',
                                    height: '8px',
                                    mr: 2,
                                    backgroundColor: theme =>
                                      sceneBase?.attributes.published === true
                                        ? theme.palette.success.main
                                        : theme.palette.warning.main,

                                    borderRadius: '50%'
                                  }}
                                />
                                <Typography variant='subtitle2'>
                                  {sceneBase?.attributes.published === true ? 'published' : 'draft'}
                                </Typography>
                              </Box>
                            </InputAdornment>
                          )
                        }}
                      />
                    )}
                  />
                  {errors.displayName && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.displayName.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Typography variant='subtitle2' sx={{ mb: 2 }}>
                    Description
                  </Typography>
                  <Controller
                    name='description'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField
                        rows={3}
                        multiline
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        error={Boolean(errors.description)}
                        placeholder='Short description...'
                      />
                    )}
                  />
                  {errors.description && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.description.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button variant='outlined' color='secondary' onClick={handleSceneEditPanelClose} sx={{ mr: 4 }}>
                  Discard
                </Button>
                <LoadingButton loading={isUpdateSceneLoading} variant='contained' type='submit'>
                  Submit
                </LoadingButton>
              </Grid>
            </Grid>
          </DialogContent>
        </form>
      </Dialog>
    </Fragment>
  )
}

export default SceneProfile
