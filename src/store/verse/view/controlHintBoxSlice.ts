// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** Types
import { IInitialState } from 'src/types/verse/view/controlHintPanelTypes'

const initialState: IInitialState = {
  title: '',
  content: []
}

const controlHintBoxSlice = createSlice({
  name: 'verse/view/controlHintBox',
  initialState,
  reducers: {
    setControlHintBox: (state, action) => {
      state.title = action.payload.title
      state.content = action.payload.content
    }
  },
  extraReducers: {}
})

export const { setControlHintBox } = controlHintBoxSlice.actions

export default controlHintBoxSlice.reducer
