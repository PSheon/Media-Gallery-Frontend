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

// ** Utils Imports
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

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

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'
import { IAsset } from 'src/types/scene/assetTypes'
import { IScene } from 'src/types/scene/sceneTypes'

interface StatusObj {
  [ke: string]: {
    text: string
    color: ThemeColor
  }
}
interface TabCoverType {
  imgWidth: number
  category: string
  imgHeight: number
}
interface TabContentType {
  imgAlt: string
  imgSrc: string
  product: string
  revenue: string
  conversion: string
  conversionDifference?: 'positive' | 'negative'
  status: 'in-stock' | 'coming-soon' | 'out-of-stock'
}
interface TabContentDataType {
  mobile: TabContentType[]
  desktop: TabContentType[]
  console: TabContentType[]
}

const statusObj: StatusObj = {
  'in-stock': { text: 'In Stock', color: 'success' },
  'coming-soon': { text: 'Coming Soon', color: 'warning' },
  'out-of-stock': { text: 'Out of Stock', color: 'primary' }
}

const tabAvatars: TabCoverType[] = [
  {
    imgWidth: 30,
    imgHeight: 58,
    category: 'mobile'
  },
  {
    imgWidth: 52,
    imgHeight: 42,
    category: 'desktop'
  },
  {
    imgWidth: 60,
    imgHeight: 42,
    category: 'console'
  }
]

const tabContentData: TabContentDataType = {
  mobile: [
    {
      revenue: '$12.5k',
      conversion: '+24',
      imgAlt: 'samsung-s22',
      status: 'out-of-stock',
      product: 'Samsung s22',
      imgSrc: '/images/cards/samsung-s22.png'
    },
    {
      revenue: '$45k',
      conversion: '-18',
      status: 'in-stock',
      imgAlt: 'apple-iPhone-13-pro',
      product: 'Apple iPhone 13 Pro',
      conversionDifference: 'negative',
      imgSrc: '/images/cards/apple-iPhone-13-pro.png'
    },
    {
      revenue: '$98.2k',
      conversion: '+55',
      status: 'coming-soon',
      imgAlt: 'oneplus-9-pro',
      product: 'Oneplus 9 Pro',
      imgSrc: '/images/cards/oneplus-9-pro.png'
    }
  ],
  desktop: [
    {
      revenue: '$94.6k',
      conversion: '+16',
      status: 'in-stock',
      imgAlt: 'apple-mac-mini',
      product: 'Apple Mac Mini',
      imgSrc: '/images/cards/apple-mac-mini.png'
    },
    {
      revenue: '$76.5k',
      conversion: '+27',
      status: 'coming-soon',
      imgAlt: 'hp-envy-x360',
      product: 'Newest HP Envy x360',
      imgSrc: '/images/cards/hp-envy-x360.png'
    },
    {
      revenue: '$69.3k',
      conversion: '-9',
      status: 'out-of-stock',
      imgAlt: 'dell-inspiron-3000',
      product: 'Dell Inspiron 3000',
      conversionDifference: 'negative',
      imgSrc: '/images/cards/dell-inspiron-3000.png'
    }
  ],
  console: [
    {
      revenue: '$18.6k',
      conversion: '+34',
      status: 'coming-soon',
      imgAlt: 'sony-play-station-5',
      product: 'Sony Play Station 5',
      imgSrc: '/images/cards/sony-play-station-5.png'
    },
    {
      revenue: '$29.7k',
      conversion: '-21',
      status: 'out-of-stock',
      imgAlt: 'xbox-series-x',
      product: 'XBOX Series X',
      conversionDifference: 'negative',
      imgSrc: '/images/cards/xbox-series-x.png'
    },
    {
      revenue: '$10.4k',
      conversion: '+38',
      status: 'in-stock',
      imgAlt: 'nintendo-switch',
      product: 'Nintendo Switch',
      imgSrc: '/images/cards/nintendo-switch.png'
    }
  ]
}

const ScenesOverviewWithTabsSection = () => {
  // ** Hooks
  const auth = useAuth()
  const router = useRouter()
  const { isLoading: isQueryLoading, data: ownSceneList = [] } = useQuery({
    queryKey: ['own-scene-list'],
    queryFn: () =>
      axios({
        method: 'GET',
        url: `/api/scenes/`,
        params: {
          filter: {
            owner: auth.user.id!
          },
          populate: {
            cover: true,
            assetList: {
              populate: {
                cover: true
              }
            }
          }
        }
      }).then(response => response.data.data as IScene[]),
    retry: 0
  })

  // ** State
  const [tabValue, setTabValue] = useState<string>('default')

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setTabValue(newValue)
  }

  const RenderTabCover = ({ sceneBase }: { sceneBase: IScene }) =>
    sceneBase?.attributes?.cover?.data?.attributes?.url ? (
      <Avatar
        variant='rounded'
        alt={`own-scene-tabs-${sceneBase?.attributes.displayName}`}
        src={`${apiConfig.publicFolderUrl}${sceneBase.attributes.cover.data.attributes.url}`}
        sx={{
          width: theme => theme.spacing(40),
          height: theme => theme.spacing(25),
          backgroundColor: 'transparent',
          border: theme =>
            tabValue === `own-scene-${sceneBase.id}`
              ? `2px solid ${theme.palette.primary.main}`
              : `2px dashed ${theme.palette.divider}`
        }}
      />
    ) : (
      <Box
        sx={{
          width: theme => theme.spacing(40),
          height: theme => theme.spacing(25),
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '.2rem',
          border: theme => `1px dashed ${theme.palette.divider}`
        }}
      >
        <Icon icon='material-symbols:add' fontSize={24} />
      </Box>
    )

  const RenderTabContent = ({ assetList = [] }: { assetList: IAsset[] }) => {
    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ '& .MuiTableCell-root': { py: theme => `${theme.spacing(2.5)} !important` } }}>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>Asset</TableCell>
              <TableCell align='center'>type</TableCell>
              <TableCell align='right'>views</TableCell>
              <TableCell align='right'>status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assetList.map(asset => {
              return (
                <TableRow
                  key={`own-scene-asset-list-${asset.id}`}
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
                      <Box sx={{ display: 'flex', maxWidth: '8rem', ml: 4, mr: 2, flexDirection: 'column' }}>
                        <Typography sx={{ fontWeight: 600 }} color='common.white' noWrap>
                          {asset?.attributes.displayName || 'Untitled'}
                        </Typography>
                        <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }} noWrap>
                          {asset?.attributes.description || 'description...'}
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
              )
            })}
          </TableBody>
        </Table>
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
          onChange={handleChange}
          aria-label='top referral sources tabs'
          sx={{
            mb: 2.5,
            px: 5,
            '& .MuiTab-root:not(:last-child)': { mr: 4 },
            '& .MuiTabs-indicator': { display: 'none' }
          }}
        >
          {ownSceneList.map(ownScene => {
            return (
              <Tab
                key={`own-scene-${ownScene.id}`}
                value={`own-scene-${ownScene.id}`}
                sx={{ p: 0 }}
                label={<RenderTabCover sceneBase={ownScene} />}
              />
            )
          })}
          {ownSceneList.length < 3 && (
            <Tab
              value='default'
              sx={{ p: 0 }}
              label={
                <Avatar
                  variant='rounded'
                  sx={{
                    width: theme => theme.spacing(40),
                    height: theme => theme.spacing(25),
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
          )}
        </TabList>

        {ownSceneList.map(ownScene => {
          console.log('ownScene, ', ownScene)

          return (
            <TabPanel key={`own-scene-asset-${ownScene.id}`} sx={{ p: 0 }} value={`own-scene-${ownScene.id}`}>
              <RenderTabContent assetList={ownScene.attributes.assetList.data!} />
            </TabPanel>
          )
        })}
        <TabPanel sx={{ p: 0 }} value='default'>
          {/* <Button>asd</Button> */}
          <CardContent sx={{ display: 'flex', textAlign: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <CustomAvatar skin='light' sx={{ width: 56, height: 56, mb: 2 }}>
              <Icon icon='mdi:help-circle-outline' fontSize='2rem' />
            </CustomAvatar>
            <Typography variant='h6' sx={{ mb: 2 }}>
              Scene
            </Typography>
            <Typography variant='body2' sx={{ mb: 6.5 }}>
              CCreate the scene you'll use to show your NFTs.
            </Typography>
            <Button
              onClick={() => router.push('/verse/create')}
              variant='contained'
              sx={{ p: theme => theme.spacing(1.75, 5.5) }}
            >
              Create new
            </Button>
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
