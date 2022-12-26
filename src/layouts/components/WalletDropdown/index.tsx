// ** React Imports
import { Fragment } from 'react'

// ** Custom Component Imports
import WalletProfileButton from './WalletProfileButton'
import ConnectWalletButton from './ConnectWalletButton'

// ** Hooks Import
import { useAuth } from 'src/hooks/useAuth'

// ** Type Imports
import { Settings } from 'src/@core/context/settingsContext'

interface Props {
  settings: Settings
}

const WalletDropdown = (props: Props) => {
  // ** Hooks
  const auth = useAuth()

  return (
    <Fragment>{auth.user.role === 'guest' ? <ConnectWalletButton /> : <WalletProfileButton {...props} />}</Fragment>
  )
}

export default WalletDropdown
