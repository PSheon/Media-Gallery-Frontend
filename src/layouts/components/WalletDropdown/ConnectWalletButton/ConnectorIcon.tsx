// ** Next Import
import Image from 'next/Image'

// ** MUI Imports
import Box from '@mui/material/Box'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

interface Props {
  connectorId: string
}

const ConnectorIcon = (props: Props) => {
  // ** Props
  const { connectorId } = props

  if (connectorId === 'metaMask') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flex: 1 }}>
        <Image height={26} width={30} src='/images/icons/wallet-connectors/metamask-flat.svg' alt='metamask icon' />
      </Box>
    )
  }
  if (connectorId === 'walletConnect') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flex: 1 }}>
        <Image
          height={32}
          width={32}
          src='/images/icons/wallet-connectors/walletConnect.png'
          alt='wallet connect icon'
        />
      </Box>
    )
  }
  if (connectorId === 'coinbaseWallet') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flex: 1 }}>
        <Image height={28} width={28} src='/images/icons/wallet-connectors/coinbase.svg' alt='coinbase icon' />
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
      <Icon icon='mdi:cog-outline' fontSize='2.375rem' />
    </Box>
  )
}

export default ConnectorIcon
