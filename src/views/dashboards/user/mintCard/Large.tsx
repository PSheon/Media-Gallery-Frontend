// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Import
import Box from '@mui/material/Box'
import ButtonGroup from '@mui/material/ButtonGroup'
import Backdrop from '@mui/material/Backdrop'
import Card from '@mui/material/Card'
import CircularProgress from '@mui/material/CircularProgress'
import Button from '@mui/material/Button'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import LinearProgress from '@mui/material/LinearProgress'

// ** React Query Imports
import { useQuery } from '@tanstack/react-query'

// ** Axios
import axios from 'axios'

// ** Wagmi Imports
import { readContract } from '@wagmi/core'
import { usePrepareContractWrite, useContractWrite } from 'wagmi'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

// ** Config Imports
import { TARGET_CHAIN_ID, CONTRACT_ADDRESS, CONTRACT_ABI } from 'src/configs/ethereum'

// ** Types
import { UserDataType } from 'src/context/types'
import { BigNumber } from 'ethers'

const MintLargeCard = () => {
  // ** States
  const [mintLoading, setMintLoading] = useState<boolean>(false)
  const [mintedCount, setMintedCount] = useState<number>(0)
  const [mintSignature, setMintSignature] = useState<string>('')
  const [mintQuantity, setMintQuantity] = useState<number>(1)
  const [mintLimit, setMintLimit] = useState<number>(1)

  // ** Hooks
  const auth = useAuth()
  const { isLoading: isCheckWhitelistLoading, isError: isCheckWhitelistError } = useQuery({
    queryKey: ['check-mint-large'],
    queryFn: () =>
      axios({
        method: 'POST',
        url: 'http://localhost:1337/api/whitelist/check',
        data: {
          address: (auth.user as UserDataType).address,
          size: 'large'
        }
      }).then(response => response.data.message as string),
    retry: 0
  })
  const { config, isError: isPrepareContractError } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'mintLargeLands',
    args: [mintSignature, mintQuantity, mintLimit]
  })
  const { write } = useContractWrite(config)

  // ** Logics
  const increaseQuantity = () => {
    setMintSignature(() => '')
    setMintQuantity(quantity => Math.min(quantity + 1, 5, mintLimit))
  }
  const decreaseQuantity = async () => {
    setMintSignature(() => '')
    setMintQuantity(quantity => Math.max(quantity - 1, 1))
  }
  const mintCard = async () => {
    setMintLoading(true)

    const { signature, limit } = await axios({
      method: 'POST',
      url: 'http://localhost:1337/api/whitelist/hash',
      data: {
        size: 'large',
        quantity: mintQuantity
      }
    })
      .then(response => response.data)
      .catch(() => {
        setMintLoading(false)
      })

    setMintSignature(() => signature)
    setMintLimit(() => limit)

    write?.()

    setMintLoading(false)
  }

  useEffect(() => {
    const checkProgress = async () => {
      const progress = (await readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'addressClaimedCountForSize',
        args: ['2', (auth.user as UserDataType).address],
        chainId: TARGET_CHAIN_ID
      })) as BigNumber

      setMintedCount(() => parseInt(progress.toString(), 10))
    }

    checkProgress()
  }, [auth.user])

  return (
    <Card sx={{ position: 'relative' }}>
      <CardMedia sx={{ height: 260 }} image='/images/logos/media-app.png' />
      <CardContent>
        <Box sx={{ mb: 3.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomChip
              skin='light'
              size='small'
              color='success'
              label='Large'
              sx={{ mr: 2.5, height: 20, fontSize: '0.75rem', fontWeight: 500 }}
            />
            <CustomChip
              skin='light'
              size='small'
              color='error'
              label='Land'
              sx={{ height: 20, fontSize: '0.75rem', fontWeight: 500 }}
            />
          </Box>
          {/* <OptionsMenu
            options={['Last 28 Days', 'Last Month', 'Last Year']}
            iconButtonProps={{ size: 'small', className: 'card-more-options' }}
          /> */}
        </Box>

        <Typography variant='h6' sx={{ mb: 1 }}>
          Large Size Land
        </Typography>
        {/* <Typography variant='body2' sx={{ mb: 4, fontWeight: 600 }}>
          Due Date: 2022/12/30
        </Typography> */}
        <Typography variant='body2' sx={{ mb: 6.25 }}>
          MediaVerse DAO, the first multi-chain EC platform based on Web3.0 and Metaverse in Aisa. Cross-device,
          cross-platform, full web interface, access to the metaverse world with only internet access.
        </Typography>
        <Box sx={{ mb: 1.25, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant='body2' sx={{ mr: 2, fontWeight: 600, color: 'text.primary' }}>
            {`${mintedCount} / 90`}
          </Typography>
          <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
            {`${(mintedCount / 90).toFixed(2)}%`}
          </Typography>
        </Box>
        <LinearProgress value={mintedCount / 90} color='success' sx={{ mb: 5.75 }} variant='determinate' />

        {isCheckWhitelistError ? (
          <Button disabled fullWidth variant='contained'>
            Not in whitelist
          </Button>
        ) : (
          <ButtonGroup fullWidth variant='contained'>
            <Button onClick={() => decreaseQuantity()} sx={{ flex: 1 }}>
              -
            </Button>
            <Button
              disabled={mintSignature !== '' && isPrepareContractError}
              onClick={() => mintCard()}
              sx={{ flex: 3 }}
            >
              {mintSignature ? `Mint ${mintQuantity}` : `Check ${mintQuantity}`}
            </Button>
            <Button onClick={() => increaseQuantity()} sx={{ flex: 1 }}>
              +
            </Button>
          </ButtonGroup>
        )}
        {/* {error && (
          <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
            {error.message}
          </Typography>
        )} */}
      </CardContent>

      <Backdrop
        open={isCheckWhitelistLoading || mintLoading}
        sx={{
          position: 'absolute',
          color: 'common.white',
          zIndex: theme => theme.zIndex.mobileStepper - 1
        }}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
    </Card>
  )
}

export default MintLargeCard
