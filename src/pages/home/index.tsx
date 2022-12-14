// ** React Imports
import { useState, useCallback } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Skeleton from '@mui/material/Skeleton'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import CardMedia from '@mui/material/CardMedia'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'

// ** Services Imports
import { useScenesQuery } from 'src/services/queries/scene.query'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Config
import apiConfig from 'src/configs/api'

const HomePage = () => {
  // ** Hooks
  const {
    isLoading: isQueryLoading,
    data: scenes = []

    // isError: isQueryError
  } = useScenesQuery({
    page: 1,
    pageSize: 25
  })

  // ** States
  const [role, setRole] = useState<string>('')
  const [plan, setPlan] = useState<string>('')
  const [status, setStatus] = useState<string>('')

  const handleRoleChange = useCallback((e: SelectChangeEvent) => {
    setRole(e.target.value)
  }, [])

  const handlePlanChange = useCallback((e: SelectChangeEvent) => {
    setPlan(e.target.value)
  }, [])

  const handleStatusChange = useCallback((e: SelectChangeEvent) => {
    setStatus(e.target.value)
  }, [])

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id='role-select'>Select Role</InputLabel>
                  <Select
                    fullWidth
                    value={role}
                    id='select-role'
                    label='Select Role'
                    labelId='role-select'
                    onChange={handleRoleChange}
                    inputProps={{ placeholder: 'Select Role' }}
                  >
                    <MenuItem value=''>Select Role</MenuItem>
                    <MenuItem value='admin'>Admin</MenuItem>
                    <MenuItem value='author'>Author</MenuItem>
                    <MenuItem value='editor'>Editor</MenuItem>
                    <MenuItem value='maintainer'>Maintainer</MenuItem>
                    <MenuItem value='subscriber'>Subscriber</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id='plan-select'>Select Plan</InputLabel>
                  <Select
                    fullWidth
                    value={plan}
                    id='select-plan'
                    label='Select Plan'
                    labelId='plan-select'
                    onChange={handlePlanChange}
                    inputProps={{ placeholder: 'Select Plan' }}
                  >
                    <MenuItem value=''>Select Plan</MenuItem>
                    <MenuItem value='basic'>Basic</MenuItem>
                    <MenuItem value='company'>Company</MenuItem>
                    <MenuItem value='enterprise'>Enterprise</MenuItem>
                    <MenuItem value='team'>Team</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id='status-select'>Select Status</InputLabel>
                  <Select
                    fullWidth
                    value={status}
                    id='select-status'
                    label='Select Status'
                    labelId='status-select'
                    onChange={handleStatusChange}
                    inputProps={{ placeholder: 'Select Role' }}
                  >
                    <MenuItem value=''>Select Role</MenuItem>
                    <MenuItem value='pending'>Pending</MenuItem>
                    <MenuItem value='active'>Active</MenuItem>
                    <MenuItem value='inactive'>Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={3}>
        <Card>
          <CardContent sx={{ display: 'flex', textAlign: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <CustomAvatar skin='light' sx={{ width: 56, height: 56, mb: 4 }}>
              <Icon icon='file-icons:3d-model' fontSize='2rem' />
            </CustomAvatar>
            <Typography variant='body1'>BUILD YOUR OWN VERSE</Typography>
            <Typography variant='body1' sx={{ mb: 4 }}>
              EXPERIENCE WITH OTHERS
            </Typography>
            <Button variant='contained' sx={{ p: theme => theme.spacing(1.75, 5.5) }}>
              Create New
            </Button>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={9}>
        <Grid container spacing={4}>
          {isQueryLoading &&
            [...Array(6).keys()].map(sIndex => (
              <Grid key={`scene-models-skeleton-${sIndex}`} item xs={12} sm={6}>
                <Skeleton variant='rounded' height={240} />
              </Grid>
            ))}

          {scenes.map(scene => (
            <Grid item key={`scene-model-${scene.id}`} xs={12} sm={6}>
              <Card sx={{ position: 'relative' }}>
                <CardMedia
                  sx={{ height: 220 }}
                  image={`${apiConfig.publicFolderUrl}${scene?.attributes?.cover?.data?.attributes.url}`}
                />
                <Avatar
                  alt={scene?.attributes?.owner?.data?.attributes.username}
                  src={`${apiConfig.publicFolderUrl}${scene?.attributes?.owner?.data?.attributes.avatar?.data?.attributes.url}`}
                  sx={{
                    top: 180,
                    left: 20,
                    width: 78,
                    height: 78,
                    position: 'absolute',
                    border: theme => `5px solid ${theme.palette.common.white}`
                  }}
                />
                <CardContent>
                  <Box
                    sx={{
                      mt: 5.75,
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Box sx={{ mr: 2, mb: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography variant='h6'>{scene?.attributes?.displayName || 'Untitled'}</Typography>
                      <Typography variant='caption'>{scene?.attributes?.description || 'no description'}</Typography>
                    </Box>
                    <Button variant='contained' component={Link} href={`/verse/book/${scene.id}`}>
                      Visit
                    </Button>
                  </Box>
                  {/* <Box
                    sx={{
                      gap: 2,
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Typography variant='caption' sx={{ whiteSpace: 'nowrap' }}>
                      {`${0} assets`}
                    </Typography>
                    <AvatarGroup max={4}>
                      <Avatar src='/images/avatars/6.png' alt='Alice Cobb' />
                      <Avatar src='/images/avatars/5.png' alt='Jeffery Warner' />
                      <Avatar src='/images/avatars/4.png' alt='Howard Lloyd' />
                      <Avatar src='/images/avatars/2.png' alt='Bettie Dunn' />
                      <Avatar src='/images/avatars/4.png' alt='Olivia Sparks' />
                      <Avatar src='/images/avatars/5.png' alt='Jimmy Hanson' />
                      <Avatar src='/images/avatars/6.png' alt='Hallie Richards' />
                    </AvatarGroup>
                  </Box> */}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  )
}

HomePage.acl = {
  action: 'read',
  subject: 'guest-page'
}

export default HomePage
