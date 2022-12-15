// ** MUI Imports
// import useMediaQuery from '@mui/material/useMediaQuery'
// import { Theme } from '@mui/material/styles'
import Grid from '@mui/material/Grid'

// import Divider from '@mui/material/Divider'

// ** Components Imports
import ControlHintBox from 'src/views/verse/components/view/settingPanel/rightSection/ControlHintBox'
import SettingBox from 'src/views/verse/components/view/settingPanel/rightSection/settingBox'

// import CollaboratorListMenu from 'src/views/verse/components/view/settingPanel/rightSection/CollaboratorsGroup'

const RightSection = () => {
  // ** Hooks
  // const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))

  return (
    <Grid container spacing={4} justifyContent='flex-end' alignItems='center' sx={{ p: 4 }}>
      {/* {isDesktop && (
        <Grid item>
          <CollaboratorListMenu />
        </Grid>
      )} */}
      {/* {isDesktop && (
        <Grid item>
          <Divider orientation='vertical' sx={{ height: '2rem' }} />
        </Grid>
      )} */}
      <Grid item>
        <ControlHintBox />
      </Grid>
      <Grid item>
        <SettingBox />
      </Grid>
    </Grid>
  )
}

export default RightSection
