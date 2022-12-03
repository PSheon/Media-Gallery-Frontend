// ** Redux Imports
import { combineReducers } from '@reduxjs/toolkit'

// ** Slice imports
import uiLayout from './uiLayoutSlice'
import loadingScreen from './loadingScreenSlice'
import startPanel from './startPanelSlice'
import scene from './sceneSlice'
import viewDialogBox from './viewDialogBoxSlice'
import controlHintPanel from './controlHintPanelSlice'

// import identity from './identitySlice'
// import explore from './exploreSlice'

const viewVerseReducers = combineReducers({
  uiLayout,
  loadingScreen,
  startPanel,
  scene,
  viewDialogBox,
  controlHintPanel

  // identity,
  // explore
})

export default viewVerseReducers
