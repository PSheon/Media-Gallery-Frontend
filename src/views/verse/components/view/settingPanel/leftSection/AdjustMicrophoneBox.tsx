// ** MUI Imports
import Tooltip from '@mui/material/Tooltip'
import Box from '@mui/material/Box'

// ** Utils Imports
import { useHMSActions, selectIsLocalAudioEnabled, useHMSStore } from '@100mslive/react-sdk'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const AdjustMicrophoneBox = () => {
  // ** Hooks
  const hmsActions = useHMSActions()
  const isLocalAudioEnabled = useHMSStore(selectIsLocalAudioEnabled)

  return (
    <Tooltip title={isLocalAudioEnabled ? 'Unmute' : 'Mute'} placement='top' arrow>
      <Box
        onClick={() => {
          hmsActions.setLocalAudioEnabled(!isLocalAudioEnabled)
        }}
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
        {isLocalAudioEnabled ? (
          <Icon icon='tabler:microphone' fontSize={20} />
        ) : (
          <Icon icon='tabler:microphone-off' fontSize={20} />
        )}
      </Box>
    </Tooltip>
  )
}

export default AdjustMicrophoneBox
