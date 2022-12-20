// ** React Imports
import { SyntheticEvent, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Import
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Tab from '@mui/material/Tab'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TabList from '@mui/lab/TabList'
import Table from '@mui/material/Table'
import TabPanel from '@mui/lab/TabPanel'
import Avatar from '@mui/material/Avatar'
import TabContext from '@mui/lab/TabContext'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'

// ** Services Imports
import { useMeScenesQuery } from 'src/services/queries/scene.query'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Config
import apiConfig from 'src/configs/api'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import OptionsMenu from 'src/@core/components/option-menu'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

// ** Types
// import { ThemeColor } from 'src/@core/layouts/types'
import { ISceneAsset } from 'src/types/sceneAssetTypes'
import { IScene } from 'src/types/sceneTypes'

const ScenesOverviewWithTabsSection = () => {
  // ** Hooks
  const router = useRouter()
  const { isLoading: isQueryLoading, data: queryData } = useMeScenesQuery()
  const meScenes = queryData?.data || []

  // ** State
  const [tabValue, setTabValue] = useState<string>('default')

  // ** Logics
  const handleTabChange = (event: SyntheticEvent, newValue: string) => {
    setTabValue(newValue)
  }
  const handleRedirectToSceneView = (sid: number) => {
    window.location.href = `/verse/book/${sid}`
  }
  const handleRedirectToSceneEdit = (sid: number) => {
    window.location.href = `/verse/edit/${sid}`
  }

  const RenderTabCover = ({ sceneBase }: { sceneBase: IScene }) => (
    <Box
      sx={{
        width: theme => theme.spacing(60),
        height: theme => theme.spacing(30),
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '.2rem',
        border: theme =>
          tabValue === `me-scene-${sceneBase.id}`
            ? `2px solid ${theme.palette.primary.main}`
            : `2px dashed ${theme.palette.divider}`
      }}
    >
      {sceneBase?.attributes?.cover?.data?.attributes?.url ? (
        <Avatar
          variant='rounded'
          alt={`me-scene-tabs-${sceneBase?.attributes.displayName}`}
          src={`${apiConfig.publicFolderUrl}${sceneBase.attributes.cover.data.attributes.url}`}
          sx={{
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent'
          }}
        />
      ) : (
        <Icon icon='material-symbols:add' fontSize={24} />
      )}
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
                sceneBase.attributes.published === true ? theme.palette.success.main : theme.palette.warning.main,

              borderRadius: '50%'
            }}
          />
          <Typography variant='body2'>{sceneBase.attributes.published === true ? 'published' : 'draft'}</Typography>
        </Box>
      </Box>
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          p: theme => theme.spacing(1, 2),
          width: '100%',
          height: theme => theme.spacing(8),
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          background: `linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.1), transparent)`
        }}
      >
        <Typography variant='caption' color='common.white' noWrap>
          {sceneBase.attributes.displayName || 'Untitled'}
        </Typography>
      </Box>
    </Box>
  )

  const RenderTabContent = ({ assetList = [] }: { assetList: ISceneAsset[] }) => {
    return (
      <TableContainer sx={{ height: '15rem' }}>
        {assetList.length ? (
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ '& .MuiTableCell-root': { py: theme => `${theme.spacing(2.5)} !important` } }}>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>Asset</TableCell>
                <TableCell align='center'>type</TableCell>
                <TableCell align='right'>views</TableCell>
                <TableCell align='right'>status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assetList.map(asset => (
                <TableRow
                  key={`me-scene-asset-list-${asset.id}`}
                  sx={{
                    '& .MuiTableCell-root': {
                      border: 0,
                      py: theme => `${theme.spacing(1.5)} !important`
                    },
                    '&:first-child .MuiTableCell-body': {
                      pt: theme => `${theme.spacing(3)} !important`
                    },
                    '&:last-child .MuiTableCell-body': {
                      pb: theme => `${theme.spacing(3)} !important`
                    }
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box>
                        <Avatar
                          src={`${apiConfig.publicFolderUrl}${asset?.attributes?.cover?.data?.attributes.url}`}
                          alt={asset?.attributes.displayName}
                          sx={{
                            width: '4.5rem',
                            height: '2.4rem',
                            borderRadius: '.2rem',
                            boxShadow: theme => theme.shadows[9]
                          }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', ml: 4, mr: 2, flexDirection: 'column' }}>
                        <Typography sx={{ fontWeight: 600 }} noWrap>
                          {asset?.attributes.displayName || 'Untitled'}
                        </Typography>
                        <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }} noWrap>
                          {asset?.attributes.description || 'no description'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align='center'>
                    <Typography variant='body2' sx={{ fontWeight: 600, whiteSpace: 'nowrap', color: 'text.primary' }}>
                      {asset?.attributes.type}
                    </Typography>
                  </TableCell>
                  <TableCell align='right'>{asset?.attributes.views}</TableCell>
                  <TableCell align='right'>
                    <CustomChip
                      skin='light'
                      size='small'
                      label='active'
                      color='primary'
                      sx={{ height: 20, fontWeight: 500, '& .MuiChip-label': { px: 1.625, lineHeight: 1.539 } }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <CardContent
            sx={{
              display: 'flex',
              width: '100%',
              height: '100%',
              textAlign: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column'
            }}
          >
            <CustomAvatar skin='light' sx={{ width: 56, height: 56, mb: 2 }}>
              <Icon icon='file-icons:3d-model' fontSize='2rem' />
            </CustomAvatar>
            <Typography variant='h6' sx={{ mb: 2 }}>
              No asset placed
            </Typography>
            <Typography variant='body2'>Use edit mode to add a new asset.</Typography>
          </CardContent>
        )}
      </TableContainer>
    )
  }

  return (
    <Card sx={{ position: 'relative' }}>
      <CardHeader
        title='Recent Scene'
        subheader='82% Activity Growth'
        action={
          <OptionsMenu
            options={['Last 28 Days', 'Last Month', 'Last Year']}
            iconButtonProps={{ size: 'small', className: 'card-more-options' }}
          />
        }
      />
      <TabContext value={tabValue}>
        <TabList
          variant='scrollable'
          scrollButtons='auto'
          onChange={handleTabChange}
          aria-label='top referral sources tabs'
          sx={{
            mb: 2.5,
            px: 5,
            '& .MuiTab-root:not(:last-child)': { mr: 4 },
            '& .MuiTabs-indicator': { display: 'none' }
          }}
        >
          {meScenes.map(meScene => (
            <Tab
              key={`me-scene-${meScene.id}`}
              value={`me-scene-${meScene.id}`}
              sx={{ p: 0 }}
              label={<RenderTabCover sceneBase={meScene} />}
            />
          ))}
          <Tab
            disabled={meScenes.length >= 3}
            value='default'
            sx={{ p: 0 }}
            label={
              <Avatar
                variant='rounded'
                sx={{
                  width: theme => theme.spacing(60),
                  height: theme => theme.spacing(30),
                  backgroundColor: 'transparent',
                  border: theme =>
                    tabValue === 'add'
                      ? `2px solid ${theme.palette.primary.main}`
                      : `2px dashed ${theme.palette.divider}`
                }}
              >
                <Box
                  sx={{
                    width: 30,
                    height: 30,
                    display: 'flex',
                    borderRadius: '8px',
                    alignItems: 'center',
                    color: 'action.active',
                    justifyContent: 'center',
                    backgroundColor: theme => hexToRGBA(theme.palette.secondary.main, 0.12)
                  }}
                >
                  <Icon icon='mdi:plus' />
                </Box>
              </Avatar>
            }
          />
        </TabList>

        {meScenes.map(meScene => (
          <TabPanel
            key={`me-scene-asset-${meScene.id}`}
            sx={{ p: 0, display: 'flex', flexDirection: 'column' }}
            value={`me-scene-${meScene.id}`}
          >
            <RenderTabContent assetList={meScene.attributes.assetList.data!} />
            <Box
              sx={{
                p: 4,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Box>
                <Button variant='outlined' onClick={() => handleRedirectToSceneView(meScene.id)}>
                  View scene
                </Button>
              </Box>
              <Box>
                <Button variant='contained' onClick={() => handleRedirectToSceneEdit(meScene.id)}>
                  Edit scene
                </Button>
              </Box>
            </Box>
          </TabPanel>
        ))}
        <TabPanel value='default'>
          <CardContent sx={{ display: 'flex', textAlign: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <CustomAvatar skin='light' sx={{ width: 56, height: 56, mb: 2 }}>
              <Icon icon='file-icons:3d-model' fontSize='2rem' />
            </CustomAvatar>
            <Typography variant='h6' sx={{ mb: 2 }}>
              Scene
            </Typography>
            <Typography variant='body2' sx={{ mb: 6.5 }}>
              Select scene to view your assets.
            </Typography>
            {meScenes.length < 3 && (
              <Button
                onClick={() => router.push('/verse/create')}
                variant='contained'
                sx={{ p: theme => theme.spacing(1.75, 5.5) }}
              >
                Create new
              </Button>
            )}
          </CardContent>
        </TabPanel>
      </TabContext>

      <Backdrop
        open={isQueryLoading}
        sx={{
          position: 'absolute',
          color: 'common.white',
          zIndex: theme => theme.zIndex.mobileStepper - 1
        }}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
    </Card>
  )
}

export default ScenesOverviewWithTabsSection
