// ** MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { Theme } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

// ** Components Imports
import ControlHintBox from 'src/views/verse/components/edit/settingPanel/rightSection/ControlHintBox'
import SettingBox from 'src/views/verse/components/edit/settingPanel/rightSection/settingBox'
import CollaboratorListMenu from 'src/views/verse/components/edit/settingPanel/rightSection/CollaboratorsGroup'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const RightSection = () => {
  // ** Hooks
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))

  return (
    <Grid container spacing={4} justifyContent='flex-end' alignItems='center' sx={{ pr: 4, py: 2, flex: 2 }}>
      {isDesktop && (
        <Grid item>
          <CollaboratorListMenu />
        </Grid>
      )}
      {isDesktop && (
        <Grid item>
          <Divider orientation='vertical' sx={{ height: '2rem' }} />
        </Grid>
      )}
      <Grid item>
        <ControlHintBox />
      </Grid>
      <Grid item>
        <SettingBox />
      </Grid>
      {isDesktop && (
        <Grid item>
          <Divider orientation='vertical' sx={{ height: '2rem' }} />
        </Grid>
      )}
      {isDesktop && (
        <Grid item>
          <Box
            sx={{
              p: 4,
              height: '100%',
              display: 'flex',
              borderRadius: 1,
              cursor: 'pointer',
              position: 'relative',
              alignItems: 'center',
              flexDirection: 'column',
              border: theme => `1px solid ${theme.palette.divider}`,
              '&:hover': { borderColor: theme => `rgba(${theme.palette.customColors.main}, 0.25)` }
            }}
          >
            <Icon icon='material-symbols:arrow-outward-rounded' fontSize={20} />
            <Typography variant='subtitle1' sx={{ fontWeight: 500, my: 'auto' }}>
              Preview
            </Typography>
          </Box>
        </Grid>
      )}
    </Grid>
  )
}

export default RightSection
