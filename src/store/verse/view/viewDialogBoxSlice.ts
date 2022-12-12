// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** Types
import { IInitialState } from 'src/types/verse/view/dialogBoxTypes'

const initialState: IInitialState = {
  show: false,
  hover: false,
  hoverObjectType: undefined,
  hoverObjectMetadata: {}
}

const viewDialogBoxSlice = createSlice({
  name: 'verse/view/dialogBox',
  initialState,
  reducers: {
    showViewDialogBox: state => {
      state.show = true
    },
    setViewDialogBox: (state, action) => {
      state.hover = true
      state.hoverObjectType = action.payload.hoverObjectType
      state.hoverObjectMetadata = action.payload.hoverObjectMetadata
    },
    setViewDialogBoxHover: (state, action) => {
      state.hover = action.payload
    },
    hideViewDialogBox: state => {
      state.show = false
      state.hover = false
    }
  },
  extraReducers: {}
})

export const { showViewDialogBox, setViewDialogBox, setViewDialogBoxHover, hideViewDialogBox } =
  viewDialogBoxSlice.actions

export default viewDialogBoxSlice.reducer
