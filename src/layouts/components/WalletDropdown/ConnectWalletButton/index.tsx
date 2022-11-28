// ** React Imports
import { Fragment, Ref, useState, forwardRef, ReactElement } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'

// ** Wagmi Imports
import { useConnect, useSignMessage, useDisconnect } from 'wagmi'
import { Connector } from '@wagmi/core'

// ** Axios
import axios from 'axios'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Component Imports
import ConnectorIcon from './ConnectorIcon'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import useBgColor from 'src/@core/hooks/useBgColor'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const ConnectWalletButton = () => {
  // ** States
  const [show, setShow] = useState<boolean>(false)
  const [connecting, setConnecting] = useState<boolean>(false)

  // ** Hooks
  const auth = useAuth()
  const bgColors = useBgColor()
  const { connectAsync, connectors, error: connectError, isLoading, pendingConnector } = useConnect()
  const { disconnect } = useDisconnect()
  const { signMessageAsync } = useSignMessage()

  const handleClose = () => {
    setShow(false)
    setConnecting(false)
  }

  // ** Logics
  const handleConnect = async (connector: Connector) => {
    try {
      setConnecting(true)
      const { account } = await connectAsync({ connector })

      const userData = { address: account, chain: '0x1', network: 'evm' }

      const { data } = await axios.post(`/api/auth/request-message`, userData)

      const message = data.message

      // signing the received message via metamask
      const signature = await signMessageAsync({ message })

      auth.login({ message, signature }, () => {
        setConnecting(false)
      })
    } catch (connectingErr) {
      disconnect()
      setConnecting(false)
    }
  }

  return (
    <Fragment>
      <Button onClick={() => setShow(true)} variant='text'>
        Connect Wallet
      </Button>
      <Dialog
        fullWidth
        open={show}
        maxWidth='sm'
        scroll='body'
        onClose={handleClose}
        onBackdropClick={handleClose}
        TransitionComponent={Transition}
      >
        <DialogContent sx={{ px: { xs: 8, sm: 15 }, py: { xs: 8, sm: 12.5 }, position: 'relative' }}>
          <IconButton size='small' onClick={handleClose} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
            <Icon icon='mdi:close' />
          </IconButton>

          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Box sx={{ mb: 3, textAlign: 'center' }}>
                <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
                  Connect your wallet
                </Typography>
                <Typography variant='body2'>
                  We only detect your wallet address to fetch your assets. We do not access or perform any on-chain
                  operation with it.
                </Typography>
              </Box>
              {connectError && <Alert severity='error'>{connectError.message}</Alert>}
            </Grid>

            {connectors.map(connector => (
              <Grid key={connector.id} item xs={12}>
                <Box
                  onClick={() => handleConnect(connector)}
                  sx={{
                    pt: 4,
                    pb: 2.75,
                    px: 7.2,
                    borderRadius: 1,
                    cursor: 'pointer',
                    ...(isLoading && connector.id === pendingConnector?.id
                      ? { ...bgColors.primaryLight }
                      : { backgroundColor: 'action.hover' }),
                    border: theme =>
                      `1px solid ${
                        isLoading && connector.id === pendingConnector?.id
                          ? theme.palette.primary.main
                          : theme.palette.secondary.main
                      }`,
                    ...(isLoading && connector.id === pendingConnector?.id
                      ? { ...bgColors.primaryLight }
                      : { backgroundColor: bgColors.secondaryLight.backgroundColor }),
                    '&:hover': {
                      border: theme => `1px solid ${theme.palette.primary.main}`,
                      ...bgColors.primaryLight
                    }
                  }}
                >
                  <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <ConnectorIcon connectorId={connector.id} />
                    <Box sx={{ flex: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <Typography
                        variant='h6'
                        sx={{
                          ...(isLoading && connector.id === pendingConnector?.id && { color: 'primary.main' })
                        }}
                      >
                        {connector.name}
                        {!connector.ready && ' (unsupported)'}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                      {(connecting || isLoading) && connector.id === pendingConnector?.id && (
                        <CircularProgress size={20} color='inherit' />
                      )}
                    </Box>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
    </Fragment>
  )
}

export default ConnectWalletButton
