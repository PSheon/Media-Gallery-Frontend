// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** Types
import { IInitialState } from 'src/types/verse/view/dialogBoxTypes'

const initialState: IInitialState = {
  show: false,
  hover: false,
  speaker: '',
  session: [],
  step: 0
}

const viewDialogBoxSlice = createSlice({
  name: 'verse/view/dialogBox',
  initialState,
  reducers: {
    showViewDialogBox: state => {
      state.show = true
    },
    setViewDialogBoxStep: state => {
      if (state.step + 1 < state.session.length) {
        state.step = state.step + 1
      } else {
        state.show = false
        state.step = 0
      }
    },
    setViewDialogBox: (state, action) => {
      state.hover = true
      state.speaker = action.payload.speaker
      state.session = action.payload.session
    },
    setViewDialogBoxHover: (state, action) => {
      state.hover = action.payload
    },
    hideViewDialogBox: state => {
      state.show = false
      state.hover = false
      state.speaker = ''
      state.step = 0
      state.session = []
    }
  },
  extraReducers: {}
})

export const { showViewDialogBox, setViewDialogBoxStep, setViewDialogBox, setViewDialogBoxHover, hideViewDialogBox } =
  viewDialogBoxSlice.actions

export default viewDialogBoxSlice.reducer
