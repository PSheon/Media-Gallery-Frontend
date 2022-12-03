// ** Redux Imports
import { combineReducers } from '@reduxjs/toolkit'

// ** Slice imports
import uiLayout from './uiLayoutSlice'
import loadingScreen from './loadingScreenSlice'
import scene from './sceneSlice'
import controlHintBox from './controlHintBoxSlice'
import editDialogBox from './editDialogBoxSlice'

const editVerseReducers = combineReducers({
  uiLayout,
  loadingScreen,
  scene,
  controlHintBox,
  editDialogBox
})

export default editVerseReducers
