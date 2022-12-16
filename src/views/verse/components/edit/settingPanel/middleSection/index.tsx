// ** React Imports
import { useState } from 'react'

// ** Redux Imports
import { useSelector } from 'react-redux'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import Card from '@mui/material/Card'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'

// ** Components Imports
import StatisticsHorizontalCard from 'src/views/verse/components/edit/settingPanel/middleSection/StatisticsHorizontalCard'

// ** Services Imports
import { useSceneQuery } from 'src/services/queries/scene.query'

// ** Utils Imports
import axios from 'axios'
import moment from 'moment'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Config
import apiConfig from 'src/configs/api'

// ** Types
import { RootState } from 'src/store'
import { ISceneAsset } from 'src/types/sceneAssetTypes'

interface FormData {
  aid: number
  attributes: {
    framePosition: string | null
    scene: string | null
  }
}

interface CellType {
  row: ISceneAsset
}

const MiddleSection = () => {
  // ** Hooks
  const router = useRouter()
  const { sid } = router.query
  const worldInstance = useSelector(({ verse }: RootState) => verse.edit.scene.worldInstance)
  const EDIT_DIALOG_BOX = useSelector(({ verse }: RootState) => verse.edit.editDialogBox)
  const queryClient = useQueryClient()
  const { isLoading: isQuerySceneBaseLoading, data: queryData } = useSceneQuery({ sid: sid as string })
  const sceneBase = queryData?.data
  const { mutate: updateAssetFrame, isLoading: isUpdateAssetFrameLoading } = useMutation({
    mutationFn: ({ aid, attributes }: FormData) =>
      axios({
        method: 'PUT',
        url: `/api/scene-assets/${aid}`,
        params: {
          populate: {
            cover: true
          }
        },
        data: {
          data: attributes
        }
      }),
    onSuccess: response => {
      queryClient.invalidateQueries(['scenes', sid])
      worldInstance?.updateAssetFrame(EDIT_DIALOG_BOX.hoverObjectMetadata!.position!, response.data.data as ISceneAsset)
      toast.success('Update asset success')
    },
    onError: () => {
      toast.error('Update asset failed')
    },
    retry: 0
  })

  // ** State
  const [statisticsDialogOpen, setStatisticsDialogOpen] = useState<boolean>(false)

  // ** Logics
  const handleStatisticsDialogOpen = () => {
    setStatisticsDialogOpen(true)
    if (worldInstance) {
      worldInstance.setDialogMode(true)
    }
  }
  const handleStatisticsDialogClose = () => {
    setStatisticsDialogOpen(false)
    if (worldInstance) {
      worldInstance.setDialogMode(false)
    }
  }
  const handleDeleteAssetFrameClick = (nftData: ISceneAsset) => {
    updateAssetFrame({
      aid: nftData.id,
      attributes: {
        framePosition: null,
        scene: null
      }
    })
  }

  // ** Render
  const renderNftBox = (row: ISceneAsset) => {
    if (
      row?.attributes?.coverFileType === 'png' ||
      row?.attributes?.coverFileType === 'jpg' ||
      row?.attributes?.coverFileType === 'svg' ||
      row?.attributes?.coverFileType === 'gif'
    ) {
      return (
        <Box
          sx={{
            width: theme => theme.spacing(8),
            height: theme => theme.spacing(8),
            mr: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '.2rem',
            '& img': {
              objectFit: 'cover'
            }
          }}
        >
          <img
            width='100%'
            height='100%'
            src={`${apiConfig.publicFolderUrl}${row?.attributes?.cover?.data?.attributes.url}`}
            alt={row?.attributes.displayName}
          />
        </Box>
      )
    }

    if (row?.attributes?.coverFileType === 'mp4') {
      return (
        <Box
          sx={{
            width: theme => theme.spacing(8),
            height: theme => theme.spacing(8),
            mr: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '.2rem',
            '& video': {
              objectFit: 'cover'
            }
          }}
        >
          <video
            width='100%'
            height='100%'
            src={`${apiConfig.publicFolderUrl}${row?.attributes?.cover?.data?.attributes.url}`}
            autoPlay
            loop
            muted
            playsInline
            crossOrigin='anonymous'
          />
        </Box>
      )
    }
  }
  const columns: GridColDef[] = [
    {
      flex: 0.5,
      field: 'asset',
      minWidth: 200,
      headerName: 'Asset',
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderNftBox(row)}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                {row?.attributes?.displayName}
              </Typography>
              <Typography variant='caption' sx={{ lineHeight: 1.6667 }}>
                {row?.attributes?.framePosition}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.3,
      minWidth: 75,
      field: 'views',
      headerName: 'Views',
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row?.attributes?.views}</Typography>
    },
    {
      flex: 0.2,
      minWidth: 75,
      field: 'action',
      headerName: 'Action',
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ px: 2, display: 'flex' }}>
          <Button variant='outlined' onClick={() => handleDeleteAssetFrameClick(row)}>
            remove
          </Button>
        </Box>
      )
    }
  ]

  return (
    <Grid container spacing={4} justifyContent='center' sx={{ px: 4, py: 2, flex: 1 }}>
      <Grid item xs={6}>
        <Box
          onClick={handleStatisticsDialogClose}
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
            ...(!statisticsDialogOpen
              ? { borderColor: `${'primary'}.main` }
              : { '&:hover': { borderColor: theme => `rgba(${theme.palette.customColors.main}, 0.25)` } })
          }}
        >
          <Icon icon='material-symbols:add-box' fontSize={20} />
          <Typography variant='subtitle1' sx={{ fontWeight: 500, my: 'auto' }}>
            Edit
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Box
          onClick={handleStatisticsDialogOpen}
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
            ...(statisticsDialogOpen
              ? { borderColor: `${'primary'}.main` }
              : { '&:hover': { borderColor: theme => `rgba(${theme.palette.customColors.main}, 0.25)` } })
          }}
        >
          <Icon icon='gridicons:stats-alt' fontSize={20} />
          <Typography variant='subtitle1' sx={{ fontWeight: 500, my: 'auto' }}>
            Statistics
          </Typography>
        </Box>
      </Grid>

      <Dialog fullWidth maxWidth='xl' onClose={handleStatisticsDialogClose} open={statisticsDialogOpen}>
        <DialogContent sx={{ backgroundColor: theme => theme.palette.action.hover }}>
          <IconButton
            size='small'
            onClick={handleStatisticsDialogClose}
            sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
          >
            <Icon icon='mdi:close-circle' fontSize={20} />
          </IconButton>
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography variant='h5' sx={{ mb: 3 }}>
              Statistics
            </Typography>
          </Box>

          <Grid container spacing={4} sx={{ flexGrow: 1 }}>
            <Grid item xs={12} sm={3}>
              <Typography variant='h5' sx={{ mb: 3 }}>
                Statistics
              </Typography>
            </Grid>
            <Grid item xs={12} sm={9}>
              <Grid container spacing={4} justifyContent='flex-end'>
                <Grid item xs={12} sm={4}>
                  <StatisticsHorizontalCard
                    stats={(5_000).toLocaleString('en-US')}
                    trend='negative'
                    trendNumber='8.1%'
                    title='Total scene views'
                    icon={<Icon icon={'material-symbols:thumb-up'} />}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StatisticsHorizontalCard
                    stats={moment().diff(moment(sceneBase?.attributes.createdAt), 'days').toLocaleString('en-US')}
                    trend='negative'
                    trendNumber='8.1%'
                    title='Create days'
                    icon={<Icon icon={'tabler:brand-days-counter'} />}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='h5' sx={{ mb: 3 }}>
                Assets stats
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <DataGrid
                  hideFooter
                  rows={sceneBase?.attributes?.assetList?.data || []}
                  columns={columns}
                  disableSelectionOnClick
                  pagination={undefined}
                  sx={{ height: '20rem' }}
                />

                <Backdrop
                  open={isQuerySceneBaseLoading || isUpdateAssetFrameLoading}
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
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Grid>
  )
}

export default MiddleSection
