// ** React Imports
import { useState } from 'react'
import { useSelector } from 'react-redux'

// ** MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { Theme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'
import InputLabel from '@mui/material/InputLabel'

// import Slider from '@mui/material/Slider'

// ** Icons Imports
// import VolumeHigh from 'mdi-material-ui/VolumeHigh'
// import VolumeOff from 'mdi-material-ui/VolumeOff'
import AutoFix from 'mdi-material-ui/AutoFix'
import LabelOutline from 'mdi-material-ui/LabelOutline'
import AlarmLightOffOutline from 'mdi-material-ui/AlarmLightOffOutline'
import AlarmLightOutline from 'mdi-material-ui/AlarmLightOutline'
import Mouse from 'mdi-material-ui/Mouse'
import MouseOff from 'mdi-material-ui/MouseOff'
import CubeOutline from 'mdi-material-ui/CubeOutline'
import CubeOffOutline from 'mdi-material-ui/CubeOffOutline'
import ChartBarStacked from 'mdi-material-ui/ChartBarStacked'

// import Ethereum from 'mdi-material-ui/Ethereum'

// ** Custom Network Switcher Component
// import NetworkSwitcher from 'src/views/verse/book/components/siteSettings/NetworkSwitcher.js'

// ** Custom Avatar Component
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Types
import { RootState } from 'src/store'

const isDevelopment = process.env.NODE_ENV !== 'production'

const DialogTabSiteSetting = () => {
  // ** Hooks
  const worldInstance = useSelector(({ verse }: RootState) => verse.scene.worldInstance)
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
    <Box>
      {/* <Box sx={{ mb: 8 }}>
        <Box sx={{ mb: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomAvatar skin='light' color='primary' variant='rounded' sx={{ mr: 3, width: 48, height: 48 }}>
              {streamingPlayerVolume > 0 ? <VolumeHigh /> : <VolumeOff />}
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
      </Box> */}
      {isDesktop && (
        <Box sx={{ mb: 8 }}>
          <Box
            sx={{ mb: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomAvatar skin='light' color='success' variant='rounded' sx={{ mr: 3, width: 48, height: 48 }}>
                {<AutoFix />}
              </CustomAvatar>
              <Box>
                <Typography>Anti Aliasing</Typography>
                <Typography variant='caption'>adjust FXAA anti aliasing composer (reload needed)</Typography>
              </Box>
            </Box>
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <InputLabel
                  htmlFor='change-anti-aliasing'
                  sx={{ cursor: 'pointer', fontSize: '0.875rem', color: 'text.secondary' }}
                >
                  disable
                </InputLabel>
                <Switch
                  id='change-anti-aliasing'
                  name='change-anti-aliasing'
                  checked={antiAliasing}
                  onChange={handleAdjustAntiAliasing}
                />
                <InputLabel
                  htmlFor='change-anti-aliasing'
                  sx={{ cursor: 'pointer', fontSize: '0.875rem', color: 'text.secondary' }}
                >
                  enable
                </InputLabel>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
      <Box sx={{ mb: 8 }}>
        <Box sx={{ mb: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomAvatar skin='light' color='success' variant='rounded' sx={{ mr: 3, width: 48, height: 48 }}>
              {<LabelOutline />}
            </CustomAvatar>
            <Box>
              <Typography>Label Visible</Typography>
              <Typography variant='caption'>adjust avatar or npc label over head</Typography>
            </Box>
          </Box>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <InputLabel
                htmlFor='change-label-visible'
                sx={{ cursor: 'pointer', fontSize: '0.875rem', color: 'text.secondary' }}
              >
                disable
              </InputLabel>
              <Switch
                id='change-label-visible'
                name='change-label-visible'
                checked={labelVisible}
                onChange={handleAdjustLabelVisible}
              />
              <InputLabel
                htmlFor='change-label-visible'
                sx={{ cursor: 'pointer', fontSize: '0.875rem', color: 'text.secondary' }}
              >
                enable
              </InputLabel>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box sx={{ mb: 8 }}>
        <Box sx={{ mb: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomAvatar skin='light' color='success' variant='rounded' sx={{ mr: 3, width: 48, height: 48 }}>
              {shadows ? <AlarmLightOutline /> : <AlarmLightOffOutline />}
            </CustomAvatar>
            <Box>
              <Typography>Shadows</Typography>
              <Typography variant='caption'>adjust scene shadows</Typography>
            </Box>
          </Box>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <InputLabel
                htmlFor='change-shadows'
                sx={{ cursor: 'pointer', fontSize: '0.875rem', color: 'text.secondary' }}
              >
                disable
              </InputLabel>
              <Switch id='change-shadows' name='change-shadows' checked={shadows} onChange={handleAdjustShadows} />
              <InputLabel
                htmlFor='change-shadows'
                sx={{ cursor: 'pointer', fontSize: '0.875rem', color: 'text.secondary' }}
              >
                enable
              </InputLabel>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box sx={{ mb: 8 }}>
        <Box sx={{ mb: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomAvatar skin='light' color='success' variant='rounded' sx={{ mr: 3, width: 48, height: 48 }}>
              {pointerLock ? <Mouse /> : <MouseOff />}
            </CustomAvatar>
            <Box>
              <Typography>Pointer Lock</Typography>
              <Typography variant='caption'>adjust the way to control camera view</Typography>
            </Box>
          </Box>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <InputLabel
                htmlFor='change-pointer-lock'
                sx={{ cursor: 'pointer', fontSize: '0.875rem', color: 'text.secondary' }}
              >
                disable
              </InputLabel>
              <Switch
                id='change-pointer-lock'
                name='change-pointer-lock'
                checked={pointerLock}
                onChange={handleAdjustPointerLock}
              />
              <InputLabel
                htmlFor='change-pointer-lock'
                sx={{ cursor: 'pointer', fontSize: '0.875rem', color: 'text.secondary' }}
              >
                enable
              </InputLabel>
            </Box>
          </Box>
        </Box>
      </Box>
      {isDevelopment && (
        <Box sx={{ mb: 8 }}>
          <Box
            sx={{ mb: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomAvatar skin='light' color='success' variant='rounded' sx={{ mr: 3, width: 48, height: 48 }}>
                {physicDebug ? <CubeOutline /> : <CubeOffOutline />}
              </CustomAvatar>
              <Box>
                <Typography>Physic Debug</Typography>
                <Typography variant='caption'>for development</Typography>
              </Box>
            </Box>
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <InputLabel
                  htmlFor='change-physic-debug'
                  sx={{ cursor: 'pointer', fontSize: '0.875rem', color: 'text.secondary' }}
                >
                  disable
                </InputLabel>
                <Switch
                  id='change-physic-debug'
                  name='change-physic-debug'
                  checked={physicDebug}
                  onChange={handleAdjustPhysicDebug}
                />
                <InputLabel
                  htmlFor='change-physic-debug'
                  sx={{ cursor: 'pointer', fontSize: '0.875rem', color: 'text.secondary' }}
                >
                  enable
                </InputLabel>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
      {isDevelopment && (
        <Box sx={{ mb: 8 }}>
          <Box
            sx={{ mb: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomAvatar skin='light' color='success' variant='rounded' sx={{ mr: 3, width: 48, height: 48 }}>
                <ChartBarStacked />
              </CustomAvatar>
              <Box>
                <Typography>FPS Debug</Typography>
                <Typography variant='caption'>for development</Typography>
              </Box>
            </Box>
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <InputLabel
                  htmlFor='change-fps-debug'
                  sx={{ cursor: 'pointer', fontSize: '0.875rem', color: 'text.secondary' }}
                >
                  disable
                </InputLabel>
                <Switch
                  id='change-fps-debug'
                  name='change-fps-debug'
                  checked={fpsDebug}
                  onChange={handleAdjustFpsDebug}
                />
                <InputLabel
                  htmlFor='change-fps-debug'
                  sx={{ cursor: 'pointer', fontSize: '0.875rem', color: 'text.secondary' }}
                >
                  enable
                </InputLabel>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
      {/* <Box>
        <Box sx={{ mb: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomAvatar skin='light' color='info' variant='rounded' sx={{ mr: 3, width: 48, height: 48 }}>
              <Ethereum />
            </CustomAvatar>
            <Box>
              <Typography>Change Network</Typography>
              <Typography variant='caption'>change network to authorize transaction</Typography>
            </Box>
          </Box>
          <NetworkSwitcher />
        </Box>
      </Box> */}
    </Box>
  )
}

export default DialogTabSiteSetting
