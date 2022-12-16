// ** React Imports
import { useSelector } from 'react-redux'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import Card, { CardProps } from '@mui/material/Card'
import { styled } from '@mui/material/styles'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Utils
import { etherAddressFormatter } from 'src/utils/ether-address-formatter'

// ** Config
import apiConfig from 'src/configs/api'

// ** Types
import { RootState } from 'src/store'

// ** Styled RootBox Components
const RootBox = styled(Box)<BoxProps>(({ theme }) => ({
  position: 'absolute',
  paddingTop: theme.spacing(4),
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
  display: 'flex',
  justifyContent: 'space-between',
  alignContent: 'center',
  width: '100%',
  background: `linear-gradient(rgba(0, 0, 0, 0.64) 0%, rgba(0, 0, 0, 0) 100%)`
}))

const StyledLink = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none'
})

// ** Styled PanelCard component
const PanelCard = styled(Card)<CardProps>(({ theme }) => ({
  width: 'fit-content',
  height: 'fit-content',
  padding: theme.spacing(1, 2),
  alignItems: 'center',
  borderRadius: '1.8rem',
  backgroundColor: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)',
  transition: theme.transitions.create('background-color'),
  '&:hover': {
    backgroundColor: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.95)'
  }
}))

// ** Styled Components
const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const AppBarPanel = () => {
  // ** Hooks
  const auth = useAuth()
  const UI_LAYOUT = useSelector(({ verse }: RootState) => verse.edit.uiLayout)

  return (
    <RootBox sx={{ display: UI_LAYOUT.appBarShow ? 'flex' : 'none' }}>
      <StyledLink href='/' passHref>
        <Avatar src='/images/logos/media-app.png' alt='media.app' sx={{ width: 48, height: 48 }} />
      </StyledLink>

      <PanelCard>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', ml: 2, mr: 4, alignItems: 'flex-end', flexDirection: 'column' }}>
            <Typography sx={{ fontWeight: 600 }}>{auth.user.username}</Typography>
            <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
              {auth.user?.address ? `${etherAddressFormatter(auth.user.address)}` : 'guest'}
            </Typography>
          </Box>
          <Badge
            overlap='circular'
            badgeContent={<BadgeContentSpan />}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
          >
            <Avatar
              alt={auth.user.username}
              src={
                auth.user.avatar ? `${apiConfig.publicFolderUrl}${auth.user.avatar as string}` : '/images/avatars/1.png'
              }
              sx={{
                width: '2.5rem',
                height: '2.5rem',
                border: theme => `2px solid ${theme.palette.primary.main}`,
                boxShadow: theme => theme.shadows[9]
              }}
            />
          </Badge>
        </Box>
      </PanelCard>
    </RootBox>
  )
}

export default AppBarPanel
