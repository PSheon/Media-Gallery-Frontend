// ** React Imports
import { useState, useEffect } from 'react'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { ISceneAsset } from 'src/types/sceneAssetTypes'

interface Props {
  chainName: ISceneAsset['attributes']['tokenChain']
}

const TokenChainIcon = (props: Props) => {
  // ** Props
  const { chainName } = props

  // ** States
  const [iconURI, setIconURI] = useState('')

  // ** Side Effect
  useEffect(() => {
    if (chainName === 'eth') {
      setIconURI('cryptocurrency-color:eth')
    }
    if (chainName === 'polygon') {
      setIconURI('cryptocurrency-color:matic')
    }
    if (chainName === 'bsc') {
      setIconURI('cryptocurrency-color:bsc')
    }
    if (chainName === 'avalanche') {
      setIconURI('cryptocurrency-color:avax')
    }
  }, [chainName])

  return <Icon icon={iconURI} />
}

export default TokenChainIcon
