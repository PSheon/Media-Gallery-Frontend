// ** React Imports
import { useState } from 'react'
import { useSelector } from 'react-redux'

// ** MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, Theme } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'

// ** Utils Imports
// @ts-ignore
import ReactNipple from 'react-nipple'

// ** Types
import { RootState } from 'src/store'

import 'react-nipple/lib/styles.css'

interface INippleData {
  direction: {
    angle: 'left' | 'up' | 'right' | 'down'
  }
}

// ** Styled RootBox component
const RootBox = styled(Box)<BoxProps>(({ theme }) => ({
  position: 'fixed',
  margin: theme.spacing(2),
  left: '50%',
  bottom: '7.5rem',
  backgroundColor: 'transparent',
  transform: 'translateX(-50%)'
}))

const MoveControlBox = () => {
  // ** Hooks
  const UI_LAYOUT = useSelector(({ verse }: RootState) => verse.view.uiLayout)
  const worldInstance = useSelector(({ verse }: RootState) => verse.view.scene.worldInstance)
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))

  // ** States
  const [currentKeyCode, setCurrentKeyCode] = useState('')

  // ** Logics
  const getKeyCodeFromAngle = (angle: string): string => {
    let keyCode = ''
    switch (angle) {
      case 'left':
        keyCode = 'KeyA'
        break
      case 'up':
        keyCode = 'KeyW'
        break
      case 'right':
        keyCode = 'KeyD'
        break
      case 'down':
        keyCode = 'KeyS'
        break
      default:
        break
    }

    return keyCode
  }

  const handleDirection = (event: KeyboardEvent, data: INippleData) => {
    const angle = data?.direction?.angle

    if (angle) {
      if (worldInstance?.inputManager.inputReceiver !== undefined) {
        if (currentKeyCode) {
          worldInstance.inputManager.inputReceiver.handleKeyboardEvent(event, currentKeyCode, false)
        }

        const keyCode = getKeyCodeFromAngle(angle)
        worldInstance.inputManager.inputReceiver.handleKeyboardEvent(event, keyCode, true)
        setCurrentKeyCode(() => keyCode)
      }
    }
  }

  const handleRelease = (event: KeyboardEvent) => {
    if (currentKeyCode && worldInstance?.inputManager.inputReceiver !== undefined) {
      worldInstance.inputManager.inputReceiver.handleKeyboardEvent(event, currentKeyCode, false)
      setCurrentKeyCode(() => '')
    }
  }

  if (isDesktop) return null

  return (
    <RootBox style={{ display: 'block', opacity: UI_LAYOUT.moveControlShow ? 1 : 0 }}>
      {/* TODO: Fix above ui show status trick */}
      <ReactNipple
        options={{ mode: 'static', position: { top: '50%', left: '50%' } }}
        style={{
          width: 150,
          height: 150
        }}
        onDir={handleDirection}
        onEnd={handleRelease}
      />
    </RootBox>
  )
}

export default MoveControlBox
