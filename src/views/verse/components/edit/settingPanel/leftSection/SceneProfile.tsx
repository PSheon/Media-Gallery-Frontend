// ** React Imports
import { useState, Fragment } from 'react'

// ** Redux Imports
import { useSelector } from 'react-redux'

// ** MUI Imports
import { styled } from '@mui/material/styles'
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

// ** React Query Imports
import { useMutation } from '@tanstack/react-query'

// ** Axios
import axios from 'axios'

// ** React Hook Form Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Components Imports
import SceneCard from 'src/views/verse/components/edit/settingPanel/leftSection/SceneCard'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

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
  displayName: yup.string().min(3).required(),
  sceneId: yup.string().required(),
  description: yup.string().optional()
})

interface FormData {
  displayName: string
}

const SceneProfile = () => {
  // ** Hooks
  const auth = useAuth()
  const worldInstance = useSelector(({ verse }: RootState) => verse.edit.scene.worldInstance)

  // const { mutate, isLoading } = useMutation({
  //   mutationFn: (newData: FormData) => axios.patch(`/api/auth/me`, newData),
  //   onSuccess: response => {
  //     auth.setUser({ ...response.data.userData })
  //   },
  //   onError: () => {
  //     setError('username', {
  //       type: 'manual',
  //       message: 'Username is invalid'
  //     })
  //   },
  //   retry: 0
  // })
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      displayName: 'Media Verse',
      sceneId: 'media-verse',
      description: 'Short description...'
    },
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  // ** States
  const [SceneEditPanelOpen, setSceneEditPanelOpen] = useState(false)

  // ** Logics
  const handleSceneEditPanelOpen = () => setSceneEditPanelOpen(true)
  const handleSceneEditPanelClose = () => setSceneEditPanelOpen(false)
  const onSubmit = (newData: FormData) => {
    // mutate(newData)
  }

  // ** Side Effect
  if (worldInstance) {
    if (SceneEditPanelOpen) {
      worldInstance.setDialogMode(true)
    } else {
      worldInstance.setDialogMode(false)
    }
  }

  return (
    <Fragment>
      <Box onClick={handleSceneEditPanelOpen}>
        <SceneCard />
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
                Fill a title to make it public in oncyber discovery. Regenerate its previews (bottom) to update its
                thumbnail and portal appearance.
              </Typography>
            </Box>

            <Grid container spacing={4} justifyContent='center'>
              <Grid item xs={12} sm={10}>
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
                        autoFocus
                        value={value}
                        onBlur={onBlur}
                        onChange={e => onChange(e.target.value.replace(' ', '-'))}
                        error={Boolean(errors.displayName)}
                        placeholder='Anonymous'
                      />
                    )}
                  />
                  {errors.displayName && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.displayName.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={10}>
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
                        onChange={e => onChange(e.target.value.replace(' ', '-'))}
                        error={Boolean(errors.sceneId)}
                        placeholder='media-verse'
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

              <Grid item xs={12} sm={10}>
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

              <Grid item xs={12} sm={10}>
                <FormControl fullWidth>
                  <Typography variant='subtitle2' sx={{ mb: 2 }}>
                    Preview
                  </Typography>
                  <Box sx={{ display: 'flex', mb: 4 }}>
                    <PreviewPicture src={'/images/avatars/1.png'} alt='preview picture' />
                  </Box>
                </FormControl>
              </Grid>

              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button variant='outlined' color='secondary' onClick={handleSceneEditPanelClose} sx={{ mr: 4 }}>
                  Discard
                </Button>
                <LoadingButton loading variant='contained' type='submit'>
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
