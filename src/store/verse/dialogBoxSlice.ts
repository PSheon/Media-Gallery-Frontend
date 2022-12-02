// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** Types
import { IInitialState } from 'src/types/verse/dialogBoxTypes'

const initialState: IInitialState = {
  show: false,
  hover: false,
  speaker: '',
  session: [],
  step: 0
}

const dialogBoxSlice = createSlice({
  name: 'verse/dialogBox',
  initialState,
  reducers: {
    showDialogBox: state => {
      state.show = true
    },
    setDialogBoxStep: state => {
      if (state.step + 1 < state.session.length) {
        state.step = state.step + 1
      } else {
        state.show = false
        state.step = 0
      }
    },
    setDialogBox: (state, action) => {
      state.hover = true
      state.speaker = action.payload.speaker
      state.session = action.payload.session
    },
    setDialogBoxHover: (state, action) => {
      state.hover = action.payload
    },
    hideDialogBox: state => {
      state.show = false
      state.hover = false
      state.speaker = ''
      state.step = 0
      state.session = []
    }
  },
  extraReducers: {}
})

export const { showDialogBox, setDialogBoxStep, setDialogBox, setDialogBoxHover, hideDialogBox } =
  dialogBoxSlice.actions

export default dialogBoxSlice.reducer
