// ** React Imports
import { useState, Ref, forwardRef, ReactElement, ReactNode } from 'react'

// ** Redux Imports
import { useSelector } from 'react-redux'

// ** MUI Imports
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import Fade, { FadeProps } from '@mui/material/Fade'
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import DialogContent from '@mui/material/DialogContent'
import TabList from '@mui/lab/TabList'
import TabContext from '@mui/lab/TabContext'
import Typography from '@mui/material/Typography'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'
import CogOutline from 'mdi-material-ui/CogOutline'

// ** Tab Content
import DialogTabSiteSetting from 'src/views/verse/components/settingPanel/settingBox/DialogTabSiteSetting'

// import DialogTabSceneSetting from 'src/views/verse/book/components/settingPanel/settingBox/DialogTabSceneSetting'
// import DialogTabAllowedVisitorSetting from 'src/views/verse/book/components/settingPanel/settingBox/DialogTabAllowedVisitorSetting'

// ** Types
import { RootState } from 'src/store'

interface Props {
  icon: ReactNode
  title: string
  subtitle: string
  active: boolean
}

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const TabLabel = (props: Props) => {
  const { icon, title, subtitle, active } = props

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          variant='rounded'
          sx={{ mr: 3, ...(active ? { color: 'common.white', backgroundColor: 'primary.main' } : {}) }}
        >
          {icon}
        </Avatar>
        <Box sx={{ textAlign: 'left' }}>
          <Typography>{title}</Typography>
          <Typography variant='caption' sx={{ textTransform: 'none' }}>
            {subtitle}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

const SettingBox = () => {
  // ** Hooks
  const worldInstance = useSelector(({ verse }: RootState) => verse.scene.worldInstance)

  // ** States
  const [open, setOpen] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<string>('siteSettings')

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
    <>
      <Tooltip title='Share' placement='top' arrow>
        <IconButton color='secondary' onClick={handleSettingBoxOpen}>
          <CogOutline />
        </IconButton>
      </Tooltip>

      <Dialog
        fullWidth
        open={open}
        scroll='body'
        maxWidth='md'
        onClose={handleSettingBoxClose}
        onBackdropClick={handleSettingBoxClose}
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
            <Close />
          </IconButton>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant='h5' sx={{ mb: 3 }}>
              Settings
            </Typography>
            <Typography variant='body2'>Update scene information.</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
            <TabContext value={activeTab}>
              <TabList
                orientation='vertical'
                onChange={(e, newValue) => setActiveTab(newValue)}
                sx={{
                  border: 0,
                  minWidth: 200,
                  '& .MuiTabs-indicator': { display: 'none' },
                  '& .MuiTabs-flexContainer': {
                    alignItems: 'flex-start',
                    '& .MuiTab-root': {
                      width: '100%',
                      alignItems: 'flex-start'
                    }
                  }
                }}
              >
                {/* <Tab
                  disableRipple
                  value='sceneSettings'
                  label={
                    <TabLabel
                      title='Scene'
                      active={activeTab === 'sceneSettings'}
                      subtitle='scene settings'
                      icon={<AccountCircleOutline />}
                    />
                  }
                /> */}
                {/* <Tab
                  disableRipple
                  value='allowedVisitorSettings'
                  label={
                    <TabLabel
                      title='Visitors'
                      active={activeTab === 'allowedVisitorSettings'}
                      subtitle='allowed visitor settings'
                      icon={<AccountGroup />}
                    />
                  }
                /> */}
                <Tab
                  disableRipple
                  value='siteSettings'
                  label={
                    <TabLabel
                      title='Site'
                      active={activeTab === 'siteSettings'}
                      subtitle='site settings'
                      icon={<CogOutline />}
                    />
                  }
                />
              </TabList>
              {/* <TabPanel value='sceneSettings' sx={{ flexGrow: 1 }}>
                <DialogTabSceneSetting />
              </TabPanel> */}
              {/* <TabPanel value='allowedVisitorSettings' sx={{ flexGrow: 1 }}>
                <DialogTabAllowedVisitorSetting />
              </TabPanel> */}
              <TabPanel value='siteSettings' sx={{ flexGrow: 1 }}>
                <DialogTabSiteSetting />
              </TabPanel>
            </TabContext>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default SettingBox
