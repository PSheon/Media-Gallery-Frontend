// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Wagmi Imports
import { useFeeData } from 'wagmi'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Config Imports
import { TARGET_CHAIN_ID } from 'src/configs/ethereum'

// Styled component for the trophy image
const TrophyImg = styled('img')(({ theme }) => ({
  right: 22,
  bottom: 0,
  width: 106,
  position: 'absolute',
  [theme.breakpoints.down('sm')]: {
    width: 95
  }
}))

const CongratulationsSection = () => {
  // ** Hooks
  const auth = useAuth()
  const { data } = useFeeData({
    chainId: TARGET_CHAIN_ID,
    formatUnits: 'gwei',
    cacheTime: 5_000,
    staleTime: 5_000
  })

  return (
    <Card sx={{ position: 'relative' }}>
      <CardContent>
        <Typography variant='h6'>
          Congratulations{' '}
          <Box component='span' sx={{ fontWeight: 'bold' }}>
            {auth.user.username ? auth.user.username.slice(0, 8) : 'Anonymous'}
          </Box>
          ! 🎉
        </Typography>
        <Typography variant='body2' sx={{ mb: 3.25 }}>
          Mint media verse now
        </Typography>
        <Typography variant='h5' sx={{ fontWeight: 600, color: 'primary.main' }}>
          {`${data?.formatted.gasPrice ? parseFloat(data.formatted.gasPrice).toFixed(2) : '--'} GWei`}
        </Typography>
        <Typography variant='body2'>Current gas price 🤟🏻</Typography>
        <TrophyImg alt='trophy' src='/images/cards/trophy.png' />
      </CardContent>
    </Card>
  )
}

export default CongratulationsSection
