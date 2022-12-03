// ** MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { Theme } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'

// ** Components Imports
import SceneListMenu from 'src/views/verse/components/edit/settingPanel/leftSection/SceneListMenu'
import SceneProfile from 'src/views/verse/components/edit/settingPanel/leftSection/SceneProfile'

const LeftSection = () => {
  // ** Hooks
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))

  return (
    <Grid container spacing={4} justifyContent='flex-start' alignItems='center' sx={{ p: 4 }}>
      <Grid item>
        <SceneListMenu />
      </Grid>
      {isDesktop && (
        <Grid item>
          <Divider orientation='vertical' sx={{ height: '2rem' }} />
        </Grid>
      )}
      {isDesktop && (
        <Grid item>
          <SceneProfile />
        </Grid>
      )}
    </Grid>
  )
}

export default LeftSection
