// ** React Imports
import { useState } from 'react'
import { useSelector } from 'react-redux'

// ** MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { Theme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'
import Grid from '@mui/material/Grid'

// import Slider from '@mui/material/Slider'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Avatar Component
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Types
import { RootState } from 'src/store'

const isDevelopment = process.env.NODE_ENV !== 'production'

const DialogTabSiteSetting = () => {
  // ** Hooks
  const worldInstance = useSelector(({ verse }: RootState) => verse.view.scene.worldInstance)
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))

  // ** State
  // const [streamingPlayerVolume, setStreamingPlayerVolume] = useState(
  //   localStorage.getItem('media_verse_settings-streaming-player-volume') !== null
  //     ? parseInt(JSON.parse(localStorage.getItem('media_verse_settings-streaming-player-volume') as string), 10)
  //     : 10
  // )

  const [labelVisible, setLabelVisible] = useState(
    localStorage.getItem('media_verse_settings-label-visible') !== null
      ? JSON.parse(localStorage.getItem('media_verse_settings-label-visible') as string)
      : true
  )

  const [antiAliasing, setAntiAliasing] = useState(
    localStorage.getItem('media_verse_settings-anti-aliasing') !== null
      ? JSON.parse(localStorage.getItem('media_verse_settings-anti-aliasing') as string)
      : true
  )

  const [shadows, setShadows] = useState(
    localStorage.getItem('media_verse_settings-shadows') !== null
      ? JSON.parse(localStorage.getItem('media_verse_settings-shadows') as string)
      : true
  )

  const [pointerLock, setPointerLock] = useState(
    localStorage.getItem('media_verse_settings-pointer-lock') !== null
      ? JSON.parse(localStorage.getItem('media_verse_settings-pointer-lock') as string)
      : true
  )

  const [physicDebug, setPhysicDebug] = useState(worldInstance!.params.Debug_Physics ?? false)
  const [fpsDebug, setFpsDebug] = useState(worldInstance!.params.Debug_FPS ?? false)

  // const handleAdjustStreamingPlayerVolume = (event: any, newVolume: number): void => {
  //   if (worldInstance?.streamingPlayer?.volume) {
  //     localStorage.setItem('media_verse_settings-streaming-player-volume', JSON.stringify(newVolume))
  //     worldInstance.streamingPlayer.volume(newVolume / 100)
  //     setStreamingPlayerVolume(newVolume)
  //   }
  // }

  const handleAdjustLabelVisible = (event: any, newLabelVisibleStatus: boolean): void => {
    localStorage.setItem('media_verse_settings-label-visible', JSON.stringify(newLabelVisibleStatus))
    worldInstance!.adjustLabelVisible(newLabelVisibleStatus)
    setLabelVisible(newLabelVisibleStatus)
  }

  const handleAdjustAntiAliasing = (event: any, newAntiAliasingStatus: boolean): void => {
    localStorage.setItem('media_verse_settings-anti-aliasing', JSON.stringify(newAntiAliasingStatus))
    worldInstance!.adjustAntiAliasing(newAntiAliasingStatus)
    setAntiAliasing(newAntiAliasingStatus)
  }

  const handleAdjustShadows = (event: any, newShadowsStatus: boolean): void => {
    localStorage.setItem('media_verse_settings-shadows', JSON.stringify(newShadowsStatus))
    worldInstance!.adjustShadows(newShadowsStatus)
    setShadows(newShadowsStatus)
  }

  const handleAdjustPointerLock = (event: any, newPointerLockStatus: boolean) => {
    localStorage.setItem('media_verse_settings-pointer-lock', JSON.stringify(newPointerLockStatus))
    worldInstance!.adjustPointerLock(newPointerLockStatus)
    setPointerLock(newPointerLockStatus)
  }

  const handleAdjustPhysicDebug = (event: any, newPhysicDebugStatus: boolean) => {
    worldInstance!.adjustPhysicDebug(newPhysicDebugStatus)
    setPhysicDebug(newPhysicDebugStatus)
  }

  const handleAdjustFpsDebug = (event: any, newFpsDebugStatus: boolean) => {
    worldInstance!.adjustFpsDebug(newFpsDebugStatus)
    setFpsDebug(newFpsDebugStatus)
  }

  return (
    <Grid container spacing={4} sx={{ flexGrow: 1 }}>
      {/* <Grid item xs={12} sx={{ mb: 4 }}>
        <Box sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomAvatar skin='light' color='primary' variant='rounded' sx={{ mr: 3, width: 48, height: 48 }}>
              <Icon icon='material-symbols:volume-down' fontSize={20} />
            </CustomAvatar>
            <Box>
              <Typography>Streaming Volume</Typography>
              <Typography variant='caption'>adjust streaming video volume</Typography>
            </Box>
          </Box>
          <Box sx={{ flexBasis: '10rem' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Slider value={streamingPlayerVolume} onChange={handleAdjustStreamingPlayerVolume} />
            </Box>
          </Box>
        </Box>
      </Grid> */}

      {isDesktop && (
        <Grid item xs={12} sx={{ mb: 4 }}>
          <Box sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomAvatar skin='light' color='success' variant='rounded' sx={{ mr: 3, width: 48, height: 48 }}>
                <Icon icon='material-symbols:auto-fix' fontSize={20} />
              </CustomAvatar>
              <Box>
                <Typography>Anti Aliasing</Typography>
                <Typography variant='caption'>adjust FXAA anti aliasing composer (reload needed)</Typography>
              </Box>
            </Box>
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Switch
                  id='change-anti-aliasing'
                  name='change-anti-aliasing'
                  checked={antiAliasing}
                  onChange={handleAdjustAntiAliasing}
                />
              </Box>
            </Box>
          </Box>
        </Grid>
      )}

      <Grid item xs={12} sx={{ mb: 4 }}>
        <Box sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomAvatar skin='light' color='success' variant='rounded' sx={{ mr: 3, width: 48, height: 48 }}>
              <Icon icon='material-symbols:label' fontSize={20} />
            </CustomAvatar>
            <Box>
              <Typography>Label Visible</Typography>
              <Typography variant='caption'>adjust avatar or npc label over head</Typography>
            </Box>
          </Box>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Switch
                id='change-label-visible'
                name='change-label-visible'
                checked={labelVisible}
                onChange={handleAdjustLabelVisible}
              />
            </Box>
          </Box>
        </Box>
      </Grid>

      <Grid item xs={12} sx={{ mb: 4 }}>
        <Box sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomAvatar skin='light' color='success' variant='rounded' sx={{ mr: 3, width: 48, height: 48 }}>
              <Icon icon='material-symbols:ev-shadow' fontSize={20} />
            </CustomAvatar>
            <Box>
              <Typography>Shadows</Typography>
              <Typography variant='caption'>adjust scene shadows</Typography>
            </Box>
          </Box>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Switch id='change-shadows' name='change-shadows' checked={shadows} onChange={handleAdjustShadows} />
            </Box>
          </Box>
        </Box>
      </Grid>

      <Grid item xs={12} sx={{ mb: 4 }}>
        <Box sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomAvatar skin='light' color='success' variant='rounded' sx={{ mr: 3, width: 48, height: 48 }}>
              <Icon icon='material-symbols:mouse' fontSize={20} />
            </CustomAvatar>
            <Box>
              <Typography>Pointer Lock</Typography>
              <Typography variant='caption'>adjust the way to control camera view</Typography>
            </Box>
          </Box>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Switch
                id='change-pointer-lock'
                name='change-pointer-lock'
                checked={pointerLock}
                onChange={handleAdjustPointerLock}
              />
            </Box>
          </Box>
        </Box>
      </Grid>

      {isDevelopment && (
        <Grid item xs={12} sx={{ mb: 4 }}>
          <Box sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomAvatar skin='light' color='success' variant='rounded' sx={{ mr: 3, width: 48, height: 48 }}>
                <Icon icon='tabler:3d-cube-sphere' fontSize={20} />
              </CustomAvatar>
              <Box>
                <Typography>Physic Debug</Typography>
                <Typography variant='caption'>for development</Typography>
              </Box>
            </Box>
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Switch
                  id='change-physic-debug'
                  name='change-physic-debug'
                  checked={physicDebug}
                  onChange={handleAdjustPhysicDebug}
                />
              </Box>
            </Box>
          </Box>
        </Grid>
      )}
      {isDevelopment && (
        <Grid item xs={12} sx={{ mb: 4 }}>
          <Box sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomAvatar skin='light' color='success' variant='rounded' sx={{ mr: 3, width: 48, height: 48 }}>
                <Icon icon='mingcute:performance-line' fontSize={20} />
              </CustomAvatar>
              <Box>
                <Typography>FPS Debug</Typography>
                <Typography variant='caption'>for development</Typography>
              </Box>
            </Box>
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Switch
                  id='change-fps-debug'
                  name='change-fps-debug'
                  checked={fpsDebug}
                  onChange={handleAdjustFpsDebug}
                />
              </Box>
            </Box>
          </Box>
        </Grid>
      )}
    </Grid>
  )
}

export default DialogTabSiteSetting
