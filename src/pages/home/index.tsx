// ** React Imports
import { useState, useEffect, ChangeEvent, useCallback } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { Theme } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
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

// ** Utils Imports
import { RoomAvailable } from 'colyseus.js'

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
  const [verseType, setVerseType] = useState<string>('all')
  const [searchTermBarOpen, setSearchTermBarOpen] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [page, setPage] = useState<number>(1)
  const [allRooms, setAllRooms] = useState<RoomAvailable[]>([])

  // ** Hooks
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))
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
  const handleOpenSearchTermBar = () => {
    setSearchTermBarOpen(true)
  }
  const handleClearFilters = () => {
    setVerseType('all')
  }
  const handleCloseSearchTermBar = () => {
    setSearchTermBarOpen(false)
    setSearchTerm('')
  }
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  // ** Side Effect
  useEffect(() => {
    const joinLobby = async () => {
      const { ColyseusClient } = await import('src/views/verse/lib/utils/Network')

      const lobby = await ColyseusClient.joinOrCreate('lobby')

      lobby.onMessage('rooms', rooms => {
        setAllRooms(() => rooms)
      })

      lobby.onMessage('+', ([roomId, room]) => {
        const roomIndex = allRooms.findIndex(room => room.roomId === roomId)
        if (roomIndex !== -1) {
          allRooms[roomIndex] = room

          setAllRooms(() => allRooms)
        } else {
          allRooms.push(room)
        }
      })

      lobby.onMessage('-', roomId => {
        setAllRooms(allRooms => allRooms.filter(room => room.roomId !== roomId))
      })
    }

    joinLobby()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            {isDesktop ? (
              <Grid container spacing={4}>
                {searchTermBarOpen && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      placeholder='Search...'
                      value={searchTerm}
                      onChange={handleSearchChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <Icon icon={isQueryLoading ? 'line-md:loading-twotone-loop' : 'material-symbols:search'} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton onClick={handleCloseSearchTermBar}>
                              <Icon icon='mingcute:close-fill' fontSize={20} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                )}
                {!searchTermBarOpen && (
                  <Grid item xs={12} sm={3} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box
                      onClick={handleOpenSearchTermBar}
                      sx={{
                        p: 4,
                        height: '100%',
                        display: 'flex',
                        borderRadius: 1,
                        cursor: 'pointer',
                        position: 'relative',
                        alignItems: 'center',
                        flexDirection: 'column',
                        border: theme => `1px solid ${theme.palette.divider}`,
                        '&:hover': { borderColor: theme => `rgba(${theme.palette.customColors.main}, 0.25)` }
                      }}
                    >
                      <Icon icon='material-symbols:search-rounded' fontSize={24} />
                    </Box>
                    {verseType !== 'all' && (
                      <Box
                        onClick={handleClearFilters}
                        sx={{
                          p: 4,
                          height: '100%',
                          display: 'flex',
                          borderRadius: 1,
                          cursor: 'pointer',
                          position: 'relative',
                          alignItems: 'center',
                          flexDirection: 'column',
                          border: theme => `1px solid ${theme.palette.divider}`,
                          '&:hover': { borderColor: theme => `rgba(${theme.palette.customColors.main}, 0.25)` }
                        }}
                      >
                        Clear filters
                      </Box>
                    )}
                  </Grid>
                )}
                {!searchTermBarOpen && (
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
                        <MenuItem value='all'>All</MenuItem>
                        <MenuItem value='classic'>Classic</MenuItem>
                        <MenuItem value='playground'>Playground</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                )}
                {!searchTermBarOpen && (
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth>
                      <InputLabel id='verse-chain-select'>Select Chain</InputLabel>
                      <Select
                        fullWidth
                        value='all'
                        label='Select Chain'
                        labelId='verse-chain-select'
                        inputProps={{ placeholder: 'Select Chain' }}
                      >
                        <MenuItem value='all'>All</MenuItem>
                        <MenuItem disabled value='eth'>
                          Ethereum
                        </MenuItem>
                        <MenuItem disabled value='polygon'>
                          Polygon
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                )}
                {!searchTermBarOpen && (
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth>
                      <InputLabel id='verse-collection-select'>Select Collection</InputLabel>
                      <Select
                        fullWidth
                        value='all'
                        label='Select Collection'
                        labelId='verse-collection-select'
                        inputProps={{ placeholder: 'Select Collection' }}
                      >
                        <MenuItem value='all'>All</MenuItem>
                        <MenuItem disabled value='eth'>
                          Media Verse
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                )}
              </Grid>
            ) : (
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    placeholder='Search...'
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <Icon icon={isQueryLoading ? 'line-md:loading-twotone-loop' : 'material-symbols:search'} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position='end'>
                          {searchTerm && (
                            <IconButton onClick={handleCloseSearchTermBar}>
                              <Icon icon='mingcute:close-fill' fontSize={20} />
                            </IconButton>
                          )}
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>
            )}
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
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        p: 2,
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'flex-end'
                      }}
                    >
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
                              allRooms.find(room => room.metadata?.sceneId === scene.id)
                                ? theme.palette.success.main
                                : theme.palette.warning.main,
                            borderRadius: '50%'
                          }}
                        />
                        <Typography variant='subtitle2'>
                          {allRooms.find(room => room.metadata?.sceneId === scene.id)
                            ? allRooms.find(room => room.metadata?.sceneId === scene.id)!.clients
                            : '0'}
                        </Typography>
                      </Box>
                    </Box>
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
                          <Typography variant='h6'>
                            {scene?.attributes?.displayName || 'Untitled'}
                            <Typography component='span' sx={{ ml: 2 }}>
                              {`• ${scene?.attributes?.assetList?.data?.length || 0} assets`}
                            </Typography>
                          </Typography>
                          <Typography variant='caption'>
                            {scene?.attributes?.description || 'no description'}
                          </Typography>
                        </Box>
                        <Button
                          fullWidth={!isDesktop}
                          variant='contained'
                          component={Link}
                          href={`/verse/book/${scene.id}`}
                          sx={{ mt: isDesktop ? 0 : 4 }}
                        >
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
