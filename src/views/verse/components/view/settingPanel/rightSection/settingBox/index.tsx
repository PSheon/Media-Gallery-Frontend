// ** React Imports
import { useState, Ref, forwardRef, ReactElement, Fragment } from 'react'

// ** Redux Imports
import { useSelector } from 'react-redux'

// ** MUI Imports
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import Fade, { FadeProps } from '@mui/material/Fade'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import DialogContent from '@mui/material/DialogContent'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Components Imports
import SiteSettingDialog from 'src/views/verse/components/view/settingPanel/rightSection/settingBox/SiteSettingDialog'

// ** Types
import { RootState } from 'src/store'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const SettingBox = () => {
  // ** Hooks
  const worldInstance = useSelector(({ verse }: RootState) => verse.edit.scene.worldInstance)

  // ** States
  const [open, setOpen] = useState<boolean>(false)

  // ** Logics
  const handleSettingBoxOpen = () => setOpen(() => true)
  const handleSettingBoxClose = () => setOpen(() => false)

  // ** Side Effect
  if (worldInstance) {
    if (open) {
      worldInstance.setDialogMode(true)
    } else {
      worldInstance.setDialogMode(false)
    }
  }

  return (
    <Fragment>
      <Tooltip title='Setting' placement='top' arrow>
        <Box
          onClick={handleSettingBoxOpen}
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
          <Icon icon='mdi:cog' fontSize={24} />
        </Box>
      </Tooltip>

      <Dialog
        fullWidth
        open={open}
        scroll='body'
        maxWidth='sm'
        onClose={handleSettingBoxClose}
        TransitionComponent={Transition}
      >
        <DialogContent
          sx={{
            pt: { xs: 8, sm: 12.5 },
            pr: { xs: 5, sm: 12 },
            pb: { xs: 5, sm: 9.5 },
            pl: { xs: 4, sm: 11 },
            position: 'relative'
          }}
        >
          <IconButton
            size='small'
            onClick={handleSettingBoxClose}
            sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
          >
            <Icon icon='mdi:close-circle' fontSize={20} />
          </IconButton>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant='h5' sx={{ mb: 3 }}>
              Settings
            </Typography>
            <Typography variant='body2'>Update scene information.</Typography>
          </Box>

          <Box sx={{ width: '100%' }}>
            <SiteSettingDialog />
          </Box>
        </DialogContent>
      </Dialog>
    </Fragment>
  )
}

export default SettingBox
