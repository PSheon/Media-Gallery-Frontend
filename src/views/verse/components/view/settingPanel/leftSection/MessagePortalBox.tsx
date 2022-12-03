// ** React Imports
import { useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import CircularProgress from '@mui/material/CircularProgress'

// ** Utils Imports
import axios from 'axios'
import { useHMSActions, selectIsConnectedToRoom, useHMSStore } from '@100mslive/react-sdk'
import toast from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Config
import apiConfig from 'src/configs/api'

const MessagePortalBox = () => {
  // ** Hooks
  const router = useRouter()
  const auth = useAuth()
  const hmsActions = useHMSActions()
  const isConnected = useHMSStore(selectIsConnectedToRoom)

  // ** States
  const [joinRoomLoading, setJoinRoomLoading] = useState<boolean>(false)

  // ** Logics
  const handleJoinRoom = async (): Promise<void> => {
    try {
      setJoinRoomLoading(true)

      const {
        data: { token }
      } = await axios({
        method: 'POST',
        url: '/api/streaming-token',
        data: {
          roomName: router.query.scene ?? 'default'
        }
      })

      if (token) {
        await hmsActions.join({
          userName: auth.user.username ?? 'Anonymous',
          authToken: token,
          metaData: JSON.stringify({
            avatarUrl: auth.user.avatar
              ? `${apiConfig.publicFolderUrl}${auth.user.avatar as string}`
              : '/images/avatars/1.png'
          }),
          settings: {
            isAudioMuted: true
          }
        })
      } else {
        toast.error('Get token failed!')
      }

      setJoinRoomLoading(false)
    } catch (err) {
      setJoinRoomLoading(false)
      console.log('err, ', err)
      toast.error('Join room failed!')
    }
  }
  const handleLeaveRoom = (): void => {
    hmsActions.leave()
  }

  return (
    <Tooltip title={isConnected ? 'Leave Room' : 'Join Chat Room'} placement='top'>
      {isConnected ? (
        <Box
          onClick={handleLeaveRoom}
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
          <Icon icon='pepicons:leave' fontSize={24} />
        </Box>
      ) : (
        <Box
          onClick={handleJoinRoom}
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
          {joinRoomLoading ? <CircularProgress size={24} /> : <Icon icon='tabler:message-circle' fontSize={24} />}
        </Box>
      )}
    </Tooltip>
  )
}

export default MessagePortalBox
