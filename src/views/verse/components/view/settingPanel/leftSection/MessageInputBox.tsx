// ** React Imports
import { useState, useRef, KeyboardEvent } from 'react'

// ** Redux Imports
import { useSelector } from 'react-redux'

// ** MUI Imports
import { styled } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField, { TextFieldProps } from '@mui/material/TextField'

// ** Utils Imports
import { useHMSActions, selectIsConnectedToRoom, selectPeers, useHMSStore } from '@100mslive/react-sdk'

// ** Types
import { RootState } from 'src/store'

// ** Styled Components
const ChatFormWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  boxShadow: theme.shadows[1],
  padding: theme.spacing(1.25, 4),
  justifyContent: 'space-between',
  transition: theme.transitions.create('background-color'),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',

  '&:hover': {
    // backgroundColor: theme.palette.background.paper
  }
}))

// ** StyledTextField Components
const StyledTextField = styled(TextField)<TextFieldProps>(() => ({
  '& .MuiOutlinedInput-input': {
    paddingLeft: 0
  },
  '& fieldset': { border: '0 !important' }
}))

const MessageInputBox = () => {
  // ** Hooks
  const hmsActions = useHMSActions()
  const peers = useHMSStore(selectPeers)
  const worldInstance = useSelector(({ verse }: RootState) => verse.view.scene.worldInstance)
  const isConnected = useHMSStore(selectIsConnectedToRoom)

  // ** States
  const [chatInput, setChatInput] = useState<string>('')

  // ** Refs
  const inputRef = useRef<HTMLElement | null>(null)

  // ** Logics
  const sendMessage = (): void => {
    if (chatInput) {
      hmsActions.sendBroadcastMessage(chatInput)
      setChatInput('')
    }

    // focus after click
    inputRef?.current?.focus()
  }
  const handleInputFocus = () => {
    if (worldInstance) {
      worldInstance.setDialogMode(true)
    }
  }

  const handleInputBlur = () => {
    if (worldInstance) {
      worldInstance.setDialogMode(false)
    }
  }
  const handleKeyPress = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter') {
      if (!event.shiftKey) {
        event.preventDefault()
        if (chatInput.trim() !== '') {
          sendMessage()
        }
      }
    }
  }

  if (!isConnected) return null

  return (
    <Box
      sx={{
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
      <ChatFormWrapper>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <StyledTextField
            fullWidth
            inputRef={inputRef}
            value={chatInput}
            placeholder='Chat now...'
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onChange={e => setChatInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              width: 6,
              height: 6,
              mr: 2,
              backgroundColor: theme => theme.palette.success.main,
              borderRadius: '50%'
            }}
          ></Box>
          <Typography variant='caption'>{peers.length ?? 0}</Typography>
        </Box>
      </ChatFormWrapper>
    </Box>
  )
}

export default MessageInputBox
