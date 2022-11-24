// ** MUI Imports
import Alert from '@mui/material/Alert'
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

// ** React Query Imports
import { useQuery } from '@tanstack/react-query'

// ** Axios
import axios, { AxiosError } from 'axios'

// ** Third Party Imports
import UAParser from 'ua-parser-js'

// ** Moment Imports
import moment from 'moment'

// ** Custom Components Imports
import OptionsMenu from 'src/@core/components/option-menu'

// Styled Timeline component
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

interface IAccess {
  id: string
  type: 'connect' | 'update_user_data' | 'create_scene'
  ip: string
  browser: string
  country?: string
  description?: string
  highlighted: boolean
  createdAt: string
}

const ActivityTimelineSection = () => {
  // ** Hooks
  const {
    isLoading: isQueryLoading,
    isError: isQueryError,
    data: accesses,
    error: queryError
  } = useQuery({
    queryKey: ['accesses-me'],
    queryFn: () =>
      axios({
        method: 'GET',
        url: 'http://localhost:1337/api/accesses/me'
      }).then(response => response.data.accesses as IAccess[])
  })

  // ** Logics
  const getTypeColor = (accessType: IAccess['type']) => {
    switch (accessType) {
      case 'connect':
        return 'error'
      case 'update_user_data':
        return 'primary'
      case 'create_scene':
      default:
        return 'info'
    }
  }
  const getTypeDisplayName = (accessType: IAccess['type']) => {
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

    const osName = parser.getOS().name
    const browserName = parser.getBrowser().name

    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <img width={28} height={28} alt={browserName} src={`/images/icons/os/${osName?.toLowerCase()}.png`} />
        <Typography variant='subtitle2' sx={{ ml: 2, fontWeight: 600 }}>
          {osName}
        </Typography>
        <Typography variant='subtitle2' sx={{ mx: 2, fontWeight: 600 }}>
          -
        </Typography>
        <img
          width={24}
          height={24}
          alt={browserName}
          src={`/images/icons/browsers/${browserName?.toLowerCase()}.png`}
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
        {isQueryError && <Alert severity='warning'>{(queryError as AxiosError).message}</Alert>}
        <Timeline sx={{ my: 0, py: 0 }}>
          {accesses?.slice(0, 3).map(access => (
            <TimelineItem key={`me-accesses-${access.id}`}>
              <TimelineSeparator>
                <TimelineDot color={getTypeColor(access.type)} />
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
                  <Typography sx={{ mr: 2, fontWeight: 600 }}>{getTypeDisplayName(access.type)}</Typography>
                  <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                    {moment(access.createdAt).fromNow()}
                  </Typography>
                </Box>
                <Typography variant='body2' sx={{ mb: 2 }}>
                  {access?.country} - {access.ip}
                </Typography>
                {renderBrowserBox(access.browser)}
              </TimelineContent>
            </TimelineItem>
          ))}
          {/* <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color='error' />
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
                <Typography sx={{ mr: 2, fontWeight: 600 }}>8 Invoices have been paid</Typography>
                <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                  Wednesday
                </Typography>
              </Box>
              <Typography variant='body2' sx={{ mb: 2 }}>
                Invoices have been paid to the company.
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <img width={24} height={24} alt='invoice.pdf' src='/images/icons/file-icons/pdf.png' />
                <Typography variant='subtitle2' sx={{ ml: 2, fontWeight: 600 }}>
                  bookingCard.pdf
                </Typography>
              </Box>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color='primary' />
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
                <Typography sx={{ mr: 2, fontWeight: 600 }}>Create a new project for client 😎</Typography>
                <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                  April, 18
                </Typography>
              </Box>
              <Typography variant='body2' sx={{ mb: 2 }}>
                Invoices have been paid to the company.
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar src='/images/avatars/1.png' sx={{ mr: 2.5, width: 24, height: 24 }} />
                <Typography variant='body2' sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                  John Doe (Client)
                </Typography>
              </Box>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem sx={{ minHeight: 0 }}>
            <TimelineSeparator>
              <TimelineDot color='info' />
              <TimelineConnector sx={{ mb: 3 }} />
            </TimelineSeparator>
            <TimelineContent sx={{ mt: 0, mb: theme => `${theme.spacing(0.5)} !important` }}>
              <Box
                sx={{
                  mb: 3,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Typography sx={{ mr: 2, fontWeight: 600 }}>Order #37745 from September</Typography>
                <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                  January, 10
                </Typography>
              </Box>
              <Typography variant='body2'>Invoices have been paid to the company.</Typography>
            </TimelineContent>
          </TimelineItem> */}
        </Timeline>
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
