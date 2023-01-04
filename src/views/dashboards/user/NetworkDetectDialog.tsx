// ** React Imports
import { Ref, forwardRef, ReactElement } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import LoadingButton from '@mui/lab/LoadingButton'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'

// ** Wagmi Imports
import { useNetwork, useSwitchNetwork, Chain } from 'wagmi'

// ** Configs Imports
import { TARGET_CHAIN_ID, TARGET_CHAIN_NAME } from 'src/configs/ethereum'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const NetworkDetectDialog = () => {
  // ** Hooks
  const { chain } = useNetwork()
  const { isLoading, switchNetwork } = useSwitchNetwork()

  // ** Logics
  const handleSwitchNetwork = async () => {
    switchNetwork?.(TARGET_CHAIN_ID)
  }

  return (
    <Dialog
      fullWidth
      open={(chain as Chain)?.id !== TARGET_CHAIN_ID}
      maxWidth='sm'
      scroll='body'
      TransitionComponent={Transition}
    >
      <DialogContent sx={{ px: { xs: 4, sm: 8 }, py: { xs: 4, sm: 6 }, position: 'relative' }}>
        {chain ? (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
              Change Network
            </Typography>
            <Typography variant='body2' sx={{ mb: 4 }}>{`Switch network from ${
              (chain as Chain)?.name
            } to ${TARGET_CHAIN_NAME}`}</Typography>

            <LoadingButton loading={isLoading} variant='contained' onClick={handleSwitchNetwork}>
              Switch
            </LoadingButton>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
              Please login to Metamask
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default NetworkDetectDialog
