// ** MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { Theme } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'

// ** Utils Imports
import { selectIsConnectedToRoom, useHMSStore } from '@100mslive/react-sdk'

// ** Components Imports
import MessagePortalBox from 'src/views/verse/components/view/settingPanel/leftSection/MessagePortalBox'
import AdjustMicrophoneBox from 'src/views/verse/components/view/settingPanel/leftSection/AdjustMicrophoneBox'
import MessageInputBox from 'src/views/verse/components/view/settingPanel/leftSection/MessageInputBox'

const LeftSection = () => {
  // ** Hooks
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))
  const isConnected = useHMSStore(selectIsConnectedToRoom)

  return (
    <Grid container spacing={4} justifyContent='flex-start' alignItems='center' sx={{ p: 4 }}>
      {isDesktop && (
        <Grid item>
          <MessageInputBox />
        </Grid>
      )}
      {isConnected && (
        <Grid item>
          <Divider orientation='vertical' sx={{ height: '2rem' }} />
        </Grid>
      )}
      {isConnected && (
        <Grid item>
          <AdjustMicrophoneBox />
        </Grid>
      )}
      <Grid item>
        <MessagePortalBox />
      </Grid>
    </Grid>
  )
}

export default LeftSection
