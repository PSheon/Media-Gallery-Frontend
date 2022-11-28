// ** MUI Import
import Avatar from '@mui/material/Avatar'
import Box, { BoxProps } from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

const FallbackSpinner = ({ sx }: { sx?: BoxProps['sx'] }) => {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        ...sx
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <Avatar src='/images/logos/media-app.png' alt='media logo' sx={{ width: 64, height: 64 }} />
        <CircularProgress disableShrink size={80} sx={{ position: 'absolute', strokeLinecap: 'round' }} />
      </Box>

      <Typography variant='h6' sx={{ mt: 4, fontWeight: 700, lineHeight: 1.2 }}>
        {themeConfig.templateName}
      </Typography>
    </Box>
  )
}

export default FallbackSpinner
