import { combineReducers } from '@reduxjs/toolkit'

import uiLayout from './uiLayoutSlice'
import loadingScreen from './loadingScreenSlice'
import startPanel from './startPanelSlice'
import scene from './sceneSlice'
import dialogBox from './dialogBoxSlice'
import controlHintPanel from './controlHintPanelSlice'

// import identity from './identitySlice'
// import explore from './exploreSlice'

const verseReducers = combineReducers({
  uiLayout,
  loadingScreen,
  startPanel,
  scene,
  dialogBox,
  controlHintPanel

  // identity,
  // explore
})

export default verseReducers
