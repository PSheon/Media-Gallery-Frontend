// ** React Imports
import { Ref, useState, forwardRef, ReactElement, Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import LoadingButton from '@mui/lab/LoadingButton'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import InputAdornment from '@mui/material/InputAdornment'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'

// ** Component Imports
// import NftImageList from './NftImageList'

// ** React Query Imports
import { useMutation } from '@tanstack/react-query'

// ** Axios
import axios from 'axios'

// ** React Hook Form Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Config
import apiConfig from 'src/configs/api'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const ProfilePicture = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  borderRadius: theme.shape.borderRadius,
  border: `5px solid ${theme.palette.common.white}`,
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4)
  }
}))

const schema = yup.object().shape({
  username: yup.string().min(3).required()
})

interface Props {
  handleDropdownClose: () => void
}
interface FormData {
  username: string
}

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const EditProfileItem = (props: Props) => {
  // ** Props
  const { handleDropdownClose } = props

  // ** Hooks
  const auth = useAuth()
  const { mutate, isLoading } = useMutation({
    mutationFn: (newData: FormData) => axios.patch(`http://localhost:1337/api/auth/me`, newData),
    onSuccess: response => {
      auth.setUser({ ...response.data.userData })
    },
    onError: () => {
      setError('username', {
        type: 'manual',
        message: 'Username is invalid'
      })
    },
    retry: 0
  })

  // ** States
  const [show, setShow] = useState<boolean>(false)

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      username: auth.user.username
    },
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const styles = {
    py: 2,
    px: 4,
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
  }

  // ** Logics
  const handleOpenDialog = () => {
    setShow(true)
  }
  const handleCloseDialog = () => {
    setShow(false)
    handleDropdownClose()
  }
  const onSubmit = (newData: FormData) => {
    mutate(newData)
  }

  return (
    <Fragment>
      <MenuItem sx={{ p: 0 }} onClick={handleOpenDialog}>
        <Box sx={styles}>
          <Icon icon='mdi:account-outline' />
          Edit Profile
        </Box>
      </MenuItem>

      <Dialog
        fullWidth
        open={show}
        maxWidth='sm'
        scroll='body'
        onClose={handleCloseDialog}
        TransitionComponent={Transition}
        onBackdropClick={handleCloseDialog}
      >
        <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
            <IconButton
              size='small'
              onClick={handleCloseDialog}
              sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
            >
              <Icon icon='mdi:close' />
            </IconButton>
            <Box sx={{ mb: 8, textAlign: 'center' }}>
              <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
                Edit Your Profile
              </Typography>
              <Typography variant='body2'>Choose NFT avatar</Typography>
            </Box>

            <Grid container spacing={6}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                  <ProfilePicture
                    src={
                      auth.user.avatar
                        ? `${apiConfig.publicFolderUrl}${auth.user.avatar as string}`
                        : '/images/avatars/1.png'
                    }
                    alt='profile picture'
                  />
                </Box>
                {/* <NftImageList /> */}
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <Controller
                    name='username'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField
                        autoFocus
                        label='Username'
                        value={value}
                        onBlur={onBlur}
                        onChange={e => onChange(e.target.value.replace(' ', '-'))}
                        error={Boolean(errors.username)}
                        placeholder='Anonymous'
                        InputProps={{
                          startAdornment: <InputAdornment position='start'>media.app/@</InputAdornment>
                        }}
                      />
                    )}
                  />
                  {errors.username && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.username.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
            <Button variant='outlined' color='secondary' onClick={() => setShow(false)} sx={{ mr: 2 }}>
              Discard
            </Button>
            <LoadingButton loading={isLoading} variant='contained' type='submit'>
              Submit
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </Fragment>
  )
}

export default EditProfileItem
