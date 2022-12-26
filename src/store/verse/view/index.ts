// ** Redux Imports
import { combineReducers } from '@reduxjs/toolkit'

// ** Slice imports
import uiLayout from './uiLayoutSlice'
import loadingScreen from './loadingScreenSlice'
import startPanel from './startPanelSlice'
import scene from './sceneSlice'
import controlHintBox from './controlHintBoxSlice'
import viewDialogBox from './viewDialogBoxSlice'

const viewVerseReducers = combineReducers({
  uiLayout,
  loadingScreen,
  startPanel,
  scene,
  controlHintBox,
  viewDialogBox
})

export default viewVerseReducers
