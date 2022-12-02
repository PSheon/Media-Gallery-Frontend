// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** Types
import { IInitialState } from 'src/types/verse/controlHintPanelTypes'

const initialState: IInitialState = {
  show: false,
  title: '',
  content: []
}

const controlHintPanelSlice = createSlice({
  name: 'verse/controlHintPanel',
  initialState,
  reducers: {
    showControlHintPanel: state => {
      state.show = true
    },
    setControlHintPanel: (state, action) => {
      state.title = action.payload.title
      state.content = action.payload.content
    },
    hideControlHintPanel: state => {
      state.show = false
    }
  },
  extraReducers: {}
})

export const { showControlHintPanel, setControlHintPanel, hideControlHintPanel } = controlHintPanelSlice.actions

export default controlHintPanelSlice.reducer
