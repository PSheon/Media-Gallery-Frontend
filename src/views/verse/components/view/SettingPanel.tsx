// ** React Imports
import { useSelector } from 'react-redux'

// ** MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled } from '@mui/material/styles'
import { Theme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'

// ** Custom Components
import MessageListBox from 'src/views/verse/components/view/settingPanel/leftSection/MessageListBox'
import LeftSection from 'src/views/verse/components/view/settingPanel/leftSection'
import MiddleSection from 'src/views/verse/components/view/settingPanel/middleSection'
import RightSection from 'src/views/verse/components/view/settingPanel/rightSection'

// ** Types
import { RootState } from 'src/store'

// ** Styled RootBox component
const RootBox = styled(Box)(({ theme }) => ({
  position: 'fixed',
  left: 0,
  bottom: 0,
  width: 'calc(100% - 2rem)',
  margin: theme.spacing(0, 4, 2),
  backgroundColor: 'transparent'
}))

// ** Styled PanelCard component
const PanelCard = styled(Card)(({ theme }) => ({
  width: '100%',
  height: '100%',
  backgroundColor: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)',
  transition: theme.transitions.create('background-color'),

  '&:hover': {
    backgroundColor: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.95)'
  }
}))

const SettingPanel = () => {
  // ** Hooks
  const UI_LAYOUT = useSelector(({ verse }: RootState) => verse.view.uiLayout)
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))

  return (
    <RootBox style={{ display: UI_LAYOUT.settingPanelShow ? 'block' : 'none' }}>
      {isDesktop && <MessageListBox />}
      <PanelCard>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {isDesktop && <LeftSection />}

          {!isDesktop && <MiddleSection />}

          {isDesktop && <RightSection />}
        </Box>
      </PanelCard>
    </RootBox>
  )
}

export default SettingPanel
