// ** MUI Imports
import { styled } from '@mui/material/styles'
import Avatar from '@mui/material/Avatar'
import Box, { BoxProps } from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** Utils Imports
import { useHMSStore, selectIsConnectedToRoom, selectHMSMessages } from '@100mslive/react-sdk'

// ** Styled RootBox component
const RootBox = styled(Box)<BoxProps>(({ theme }) => ({
  width: '30ch',
  height: '100%',
  maxHeight: '30ch',
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)',
  transition: theme.transitions.create('background-color'),

  '&:hover': {
    backgroundColor: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.95)'
  }
}))

const MessageListBox = () => {
  // ** Hooks
  const isConnected = useHMSStore(selectIsConnectedToRoom)
  const storeMessages = useHMSStore(selectHMSMessages)

  if (!isConnected) return null

  return (
    <RootBox>
      {storeMessages.slice(-8).map(message => (
        <Grid item key={message.id}>
          <Box sx={{ px: 4, py: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ mr: 3, width: 20, height: 20 }}>{message.senderName}</Avatar>
            <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: '22ch' }}>
              <Typography variant='subtitle2' sx={{ color: 'text.primary' }} noWrap>
                {message.message}
              </Typography>
            </Box>
          </Box>
        </Grid>
      ))}
    </RootBox>
  )
}

export default MessageListBox
