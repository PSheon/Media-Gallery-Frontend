// ** MUI Imports
import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Backdrop from '@mui/material/Backdrop'
import Card from '@mui/material/Card'
import CircularProgress from '@mui/material/CircularProgress'
import { styled } from '@mui/material/styles'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import MuiTimeline, { TimelineProps } from '@mui/lab/Timeline'

// ** Utils Imports
import UAParser from 'ua-parser-js'
import { AxiosError } from 'axios'
import moment from 'moment'

// ** Services Imports
import { useMeAccessesQuery } from 'src/services/queries/dashboard/access.query'

// ** Components Imports
import OptionsMenu from 'src/@core/components/option-menu'

// ** Types Imports
import { IAccessType } from 'src/types/dashboard/accessTypes'

// ** Styled Timeline component
const Timeline = styled(MuiTimeline)<TimelineProps>({
  paddingLeft: 0,
  paddingRight: 0,
  '& .MuiTimelineItem-root': {
    width: '100%',
    '&:before': {
      display: 'none'
    }
  }
})

const ActivityTimelineSection = () => {
  // ** Hooks
  const {
    isLoading: isQueryLoading,
    isError: isQueryError,
    data: accesses = [],
    error: queryError
  } = useMeAccessesQuery({ limit: 3 })

  // ** Logics
  const getTypeColor = (accessType: IAccessType) => {
    switch (accessType) {
      case 'connect':
        return 'warning'
      case 'update_user_data':
        return 'primary'
      case 'create_scene':
      default:
        return 'info'
    }
  }
  const getTypeDisplayName = (accessType: IAccessType) => {
    switch (accessType) {
      case 'connect':
        return 'Connect Wallet'
      case 'update_user_data':
        return 'Update User Data'
      case 'create_scene':
        return 'Create Scene'
      default:
        return 'Unknown'
    }
  }

  // ** Render
  const renderBrowserBox = (accessBrowser: string) => {
    const parser = new UAParser()
    parser.setUA(accessBrowser)

    const osName = parser.getOS().name?.toLowerCase()
    const browserName = parser.getBrowser().name?.toLowerCase()

    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          src={`/images/icons/os/${osName}.png`}
          alt={browserName}
          sx={{
            width: 28,
            height: 28,
            borderRadius: 0.6,
            p: 1,
            background: theme => theme.palette.background.default
          }}
        />
        <Typography variant='subtitle2' sx={{ ml: 2, fontWeight: 600 }}>
          {osName}
        </Typography>
        <Typography variant='subtitle2' sx={{ mx: 2, fontWeight: 600 }}>
          -
        </Typography>
        <Avatar
          src={`/images/icons/browsers/${browserName}.png`}
          alt={browserName}
          sx={{
            width: 24,
            height: 24,
            borderRadius: 0.6,
            p: 1,
            background: theme => theme.palette.background.default
          }}
        />
        <Typography variant='subtitle2' sx={{ ml: 2, fontWeight: 600 }}>
          {browserName}
        </Typography>
      </Box>
    )
  }

  return (
    <Card sx={{ position: 'relative' }}>
      <CardHeader
        title='Activity Timeline'
        action={
          <OptionsMenu
            options={['Last 28 Days', 'Last Month', 'Last Year']}
            iconButtonProps={{ size: 'small', className: 'card-more-options' }}
          />
        }
      />
      <CardContent sx={{ pt: theme => `${theme.spacing(2.5)} !important` }}>
        {isQueryError ? (
          <Alert severity='warning'>{(queryError as AxiosError).message}</Alert>
        ) : (
          <Timeline sx={{ my: 0, py: 0 }}>
            {accesses.map(access => (
              <TimelineItem key={`accesses-me-${access.id}`}>
                <TimelineSeparator>
                  <TimelineDot color={getTypeColor(access.attributes.type)} />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent sx={{ mt: 0, mb: theme => `${theme.spacing(3)} !important` }}>
                  <Box
                    sx={{
                      mb: 3,
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Typography sx={{ mr: 2, fontWeight: 600 }}>
                      {getTypeDisplayName(access.attributes.type)}
                    </Typography>
                    <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                      {moment(access.attributes.createdAt).fromNow()}
                    </Typography>
                  </Box>
                  <Typography variant='body2' sx={{ mb: 2 }}>
                    {access.attributes.country} - {access.attributes.ip}
                  </Typography>
                  {renderBrowserBox(access.attributes.browser)}
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        )}
      </CardContent>

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

export default ActivityTimelineSection
