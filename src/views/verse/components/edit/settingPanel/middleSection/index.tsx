// ** React Imports
import { useState } from 'react'

// ** Redux Imports
import { useSelector } from 'react-redux'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'

// ** Components Imports
import StatisticsHorizontalCard from 'src/views/verse/components/edit/settingPanel/middleSection/StatisticsHorizontalCard'
import AssetsStatsTable from 'src/views/verse/components/edit/settingPanel/middleSection/AssetsStatsTable'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { RootState } from 'src/store'

const MiddleSection = () => {
  // ** Hooks
  const worldInstance = useSelector(({ verse }: RootState) => verse.edit.scene.worldInstance)

  // ** State
  const [statisticsDialogOpen, setStatisticsDialogOpen] = useState<boolean>(false)

  // ** Logics
  const handleStatisticsDialogOpen = () => setStatisticsDialogOpen(true)
  const handleStatisticsDialogClose = () => setStatisticsDialogOpen(false)

  // ** Side Effect
  if (worldInstance) {
    if (statisticsDialogOpen) {
      worldInstance.setDialogMode(true)
    } else {
      worldInstance.setDialogMode(false)
    }
  }

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
              <Grid container spacing={4}>
                <Grid item xs={12} sm={4}>
                  <StatisticsHorizontalCard
                    stats='8,458'
                    trend='negative'
                    trendNumber='8.1%'
                    title='New Customers'
                    icon={<Icon icon={'mdi:account-outline'} />}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StatisticsHorizontalCard
                    stats='8,458'
                    trend='negative'
                    trendNumber='8.1%'
                    title='New Customers'
                    icon={<Icon icon={'mdi:account-outline'} />}
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
              <AssetsStatsTable />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Grid>
  )
}

export default MiddleSection
