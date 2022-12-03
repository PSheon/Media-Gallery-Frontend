// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** Types
import { IInitialState } from 'src/types/verse/view/controlHintPanelTypes'

const initialState: IInitialState = {
  title: '',
  content: []
}

const controlHintPanelSlice = createSlice({
  name: 'verse/view/controlHintPanel',
  initialState,
  reducers: {
    setControlHintPanel: (state, action) => {
      state.title = action.payload.title
      state.content = action.payload.content
    }
  },
  extraReducers: {}
})

export const { setControlHintPanel } = controlHintPanelSlice.actions

export default controlHintPanelSlice.reducer
