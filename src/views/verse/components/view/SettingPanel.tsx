// ** React Imports
import { useSelector } from 'react-redux'

// ** MUI Imports
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'

// ** Custom Components
import ControlHintBox from 'src/views/verse/components/view/settingPanel/ControlHintBox'
import SettingBox from 'src/views/verse/components/view/settingPanel/SettingBox'

// ** Types
import { RootState } from 'src/store'

// ** Styled RootBox component
const RootBox = styled(Box)(({ theme }) => ({
  position: 'fixed',
  margin: theme.spacing(2),

  right: 0,
  bottom: 0,
  backgroundColor: 'transparent'
}))

// ** Styled PanelCard component
const PanelCard = styled(Card)(({ theme }) => ({
  width: 'fit-content',
  backgroundColor: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
  transition: theme.transitions.create('background-color'),

  '&:hover': {
    backgroundColor: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.95)'
  }
}))

const SettingPanel = () => {
  // ** Hooks
  const UI_LAYOUT = useSelector(({ verse }: RootState) => verse.view.uiLayout)

  return (
    <RootBox style={{ display: UI_LAYOUT.settingPanelShow ? 'block' : 'none' }}>
      <PanelCard>
        <Grid container>
          <Grid item>
            <ControlHintBox />
          </Grid>

          <Grid item>
            <SettingBox />
          </Grid>
        </Grid>
      </PanelCard>
    </RootBox>
  )
}

export default SettingPanel
