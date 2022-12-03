// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** Types
import { IInitialState } from 'src/types/verse/edit/ControlHintBoxTypes'

const initialState: IInitialState = {
  title: '',
  content: []
}

const ControlHintBoxSlice = createSlice({
  name: 'verse/edit/ControlHintBox',
  initialState,
  reducers: {
    setControlHintPanel: (state, action) => {
      state.title = action.payload.title
      state.content = action.payload.content
    }
  },
  extraReducers: {}
})

export const { setControlHintPanel } = ControlHintBoxSlice.actions

export default ControlHintBoxSlice.reducer
