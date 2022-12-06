// ** MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { Theme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const CreateSceneCard = () => {
  // ** Hooks
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))

  // ** Logics
  const handleRedirectToSceneCreate = () => {
    window.location.href = `/verse/create`
  }

  return (
    <Box
      onClick={() => handleRedirectToSceneCreate()}
      sx={{
        p: 4,
        height: '100%',
        display: 'flex',
        borderRadius: 1,
        cursor: 'pointer',
        position: 'relative',
        alignItems: 'center',
        border: theme => `1px solid ${theme.palette.divider}`,
        '&:hover': { borderColor: theme => `rgba(${theme.palette.customColors.main}, 0.25)` }
      }}
    >
      <Box
        sx={{
          width: isDesktop ? '5.8rem' : '4rem',
          height: isDesktop ? '3.6rem' : '2.4rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '.2rem',
          border: theme => `1px dashed ${theme.palette.divider}`
        }}
      >
        <Icon icon='material-symbols:add' fontSize={24} />
      </Box>
      <Box sx={{ display: 'flex', ml: 4, mr: 2, flexDirection: 'column' }}>
        <Typography sx={{ fontWeight: 600 }} color='common.white'>
          Create New Scene
        </Typography>
      </Box>
    </Box>
  )
}

export default CreateSceneCard
