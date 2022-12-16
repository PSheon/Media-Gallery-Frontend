// ** React Imports
import { useState, ChangeEvent, useCallback } from 'react'

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
import TextField from '@mui/material/TextField'
import Pagination from '@mui/material/Pagination'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'

// ** Services Imports
import { useScenesQuery } from 'src/services/queries/scene.query'

// ** Hooks Imports
import useDebounce from 'src/hooks/useDebounce'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Config
import apiConfig from 'src/configs/api'

const HomePage = () => {
  // ** States
  // const [role, setRole] = useState<string>('')
  // const [plan, setPlan] = useState<string>('')
  const [verseType, setVerseType] = useState<string>('classic')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [page, setPage] = useState<number>(1)
  const debouncedSearchTerm = useDebounce<string>(searchTerm, 500)
  const {
    isLoading: isQueryLoading,
    data: queryData

    // isError: isQueryError
  } = useScenesQuery({
    displayName: debouncedSearchTerm,
    type: verseType,
    page,
    pageSize: 24
  })
  const scenes = queryData?.data || []
  const meta = queryData?.meta || { pagination: { page: 1, pageCount: 1, pageSize: 24, total: 0 } }

  // ** Logics
  // const handleRoleChange = useCallback((e: SelectChangeEvent) => {
  //   setRole(e.target.value)
  // }, [])
  // const handlePlanChange = useCallback((e: SelectChangeEvent) => {
  //   setPlan(e.target.value)
  // }, [])
  const handleStatusChange = useCallback((e: SelectChangeEvent) => {
    setVerseType(e.target.value)
  }, [])
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Grid container spacing={4}>
              {/* <Grid item xs={12} sm={3}>
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
              <Grid item xs={12} sm={3}>
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
              </Grid> */}
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                  <InputLabel id='verse-type-select'>Select Type</InputLabel>
                  <Select
                    fullWidth
                    value={verseType}
                    label='Select Type'
                    labelId='verse-type-select'
                    onChange={handleStatusChange}
                    inputProps={{ placeholder: 'Select Type' }}
                  >
                    <MenuItem value='classic'>Classic</MenuItem>
                    <MenuItem value='playground'>Playground</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={9}>
                <TextField
                  fullWidth
                  placeholder='Search...'
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <Icon icon={isQueryLoading ? 'line-md:loading-twotone-loop' : 'material-symbols:search'} />
                      </InputAdornment>
                    )
                  }}
                />
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
            <Button
              component={Link}
              href='/verse/create'
              variant='contained'
              sx={{ p: theme => theme.spacing(1.75, 5.5) }}
            >
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

          {scenes.length ? (
            scenes
              .map(scene => (
                <Grid item key={`scene-model-${scene.id}`} xs={12} sm={6}>
                  <Card sx={{ position: 'relative' }}>
                    <CardMedia
                      sx={{ height: 220 }}
                      image={
                        scene?.attributes?.cover?.data?.attributes.url
                          ? `${apiConfig.publicFolderUrl}${scene?.attributes?.cover?.data?.attributes.url}`
                          : '/images/logos/media-app.png'
                      }
                    />
                    <Avatar
                      alt={scene?.attributes?.owner?.data?.attributes.username}
                      src={
                        scene?.attributes?.owner?.data?.attributes.avatar?.data?.attributes.url
                          ? `${apiConfig.publicFolderUrl}${scene?.attributes?.owner?.data?.attributes.avatar?.data?.attributes.url}`
                          : '/images/avatars/1.png'
                      }
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
                          <Typography variant='caption'>
                            {scene?.attributes?.description || 'no description'}
                          </Typography>
                        </Box>
                        <Button variant='contained' component={Link} href={`/verse/book/${scene.id}`}>
                          Visit
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
              .concat(
                <Grid key='scene-model-pagination' item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Pagination
                    count={meta.pagination.pageCount}
                    onChange={(e, newPage) => setPage(newPage)}
                    shape='rounded'
                    color='primary'
                  />
                </Grid>
              )
          ) : (
            <Grid item xs={12}>
              <Card>
                <CardContent
                  sx={{ display: 'flex', textAlign: 'center', alignItems: 'center', flexDirection: 'column' }}
                >
                  <CustomAvatar skin='light' sx={{ width: 56, height: 56, mb: 2 }}>
                    <Icon icon='mdi:help-circle-outline' fontSize='2rem' />
                  </CustomAvatar>
                  <Typography variant='h6' sx={{ mb: 2 }}>
                    No results found.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
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
