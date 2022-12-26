// ** React Imports
import { ReactNode } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { AvatarProps } from '@mui/material/Avatar'

// ** Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

interface Props {
  title: string
  stats: string
  icon: ReactNode
  color?: ThemeColor
}

// ** Styled Avatar component
const Avatar = styled(CustomAvatar)<AvatarProps>(({ theme }) => ({
  width: 40,
  height: 40,
  marginRight: theme.spacing(4)
}))

const StatisticsHorizontalCard = (props: Props) => {
  // ** Props
  const { title, icon, stats, color = 'primary' } = props

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Avatar skin='light' color={color} variant='rounded'>
        {icon}
      </Avatar>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
          <Typography variant='h6'>{stats}</Typography>
        </Box>
        <Typography variant='caption'>{title}</Typography>
      </Box>
    </Box>
  )
}

export default StatisticsHorizontalCard
