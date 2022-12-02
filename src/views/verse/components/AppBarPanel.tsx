// ** React Imports
import { useSelector } from 'react-redux'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'

// ** Types
import { RootState } from 'src/store'

// ** Styled RootBox Components
const RootBox = styled(Box)(({ theme }) => ({
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
const PanelCard = styled(Card)(({ theme }) => ({
  width: 'fit-content',
  height: 'fit-content',
  padding: theme.spacing(0),
  alignItems: 'center',
  borderRadius: '1.8rem',
  backgroundColor: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
  transition: theme.transitions.create('background-color'),

  '&:hover': {
    backgroundColor: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.95)'
  }
}))

const AppBarPanel = () => {
  // ** Hooks
  const UI_LAYOUT = useSelector(({ verse }: RootState) => verse.uiLayout)

  return (
    <RootBox sx={{ display: UI_LAYOUT.appBarShow ? 'flex' : 'none' }}>
      <StyledLink href='/' passHref>
        <Avatar src='/images/logos/media-app.png' alt='media.app' sx={{ width: 48, height: 48 }} />
      </StyledLink>

      <PanelCard>
        <Typography>Profile</Typography>
      </PanelCard>
    </RootBox>
  )
}

export default AppBarPanel
