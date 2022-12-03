// ** Redux Imports
import { combineReducers } from '@reduxjs/toolkit'

// ** Slice imports
import uiLayout from './uiLayoutSlice'
import loadingScreen from './loadingScreenSlice'
import startPanel from './startPanelSlice'
import scene from './sceneSlice'
import controlHintBox from './controlHintBoxSlice'
import viewDialogBox from './viewDialogBoxSlice'

// import identity from './identitySlice'

const viewVerseReducers = combineReducers({
  uiLayout,
  loadingScreen,
  startPanel,
  scene,
  controlHintBox,
  viewDialogBox

  // identity,
})

export default viewVerseReducers
