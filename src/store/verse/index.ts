// ** Redux Imports
import { combineReducers } from '@reduxjs/toolkit'

// ** Slice imports
import view from './view'
import edit from './edit'

const verseReducers = combineReducers({
  view,
  edit
})

export default verseReducers
