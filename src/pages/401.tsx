// ** React Imports
import { useState, ReactNode } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Components
import { styled } from '@mui/material/styles'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Box, { BoxProps } from '@mui/material/Box'
import Divider from '@mui/material/Divider'

// ** Utils Imports
import { useConnect, useSignMessage, useDisconnect, Connector } from 'wagmi'
import axios from 'axios'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import useBgColor from 'src/@core/hooks/useBgColor'

// ** Components Imports
import FooterIllustrations from 'src/views/pages/misc/FooterIllustrations'
import ConnectorIcon from 'src/layouts/components/WalletDropdown/ConnectWalletButton/ConnectorIcon'

// ** Styled Components
const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: theme.spacing(120),

  [theme.breakpoints.down('sm')]: {
    width: '90vw'
  }
}))

const Error401 = () => {
  // ** States
  const [connecting, setConnecting] = useState<boolean>(false)

  // ** Hooks
  const auth = useAuth()
  const bgColors = useBgColor()
  const { connectAsync, connectors, error: connectError, isLoading, pendingConnector } = useConnect()
  const { disconnect } = useDisconnect()
  const { signMessageAsync } = useSignMessage()

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
    <Box className='content-center'>
      <BoxWrapper>
        <Grid container spacing={6} justifyContent='center' alignItems='center' sx={{ p: 5 }}>
          <Grid item xs={12}>
            <Typography variant='h4' align='center' sx={{ mb: 2.5 }}>
              Connect your wallet
            </Typography>
            <Typography variant='body2' align='center'>
              We only detect your wallet address to fetch your assets.
            </Typography>
            <Typography variant='body2' align='center'>
              We do not access or perform any on-chain operation with it.
            </Typography>
          </Grid>

          {connectError && (
            <Grid item xs={12}>
              <Alert severity='error'>{connectError.message}</Alert>
            </Grid>
          )}

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

          <Grid item xs={12}>
            <Divider sx={{ my: 4 }}>or</Divider>
          </Grid>

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button href='/' component={Link} variant='contained' sx={{ px: 5.5 }}>
              Back to Home
            </Button>
          </Grid>
        </Grid>
      </BoxWrapper>
      <FooterIllustrations image='/images/pages/misc-401-object.png' />
    </Box>
  )
}

Error401.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default Error401
