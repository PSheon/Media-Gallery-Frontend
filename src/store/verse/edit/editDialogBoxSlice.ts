// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** Types
import { IInitialState } from 'src/types/verse/edit/dialogBoxTypes'

const initialState: IInitialState = {
  show: false,
  hover: false,
  hoverObjectType: undefined,
  hoverObjectMetadata: undefined
}

const dialogBoxSlice = createSlice({
  name: 'verse/edit/dialogBox',
  initialState,
  reducers: {
    showEditDialogBox: state => {
      state.show = true
    },
    setEditDialogBox: (state, action) => {
      state.hover = true
      state.hoverObjectType = action.payload.hoverObjectType
      state.hoverObjectMetadata = action.payload.hoverObjectMetadata
    },
    setEditDialogBoxHover: (state, action) => {
      const newHoverStatus = action.payload
      if (newHoverStatus) {
        state.hover = true
      } else {
        state.hover = false
        state.hoverObjectType = undefined
        state.hoverObjectMetadata = undefined
      }
    },
    hideEditDialogBox: state => {
      state.show = false
      state.hover = false
    }
  },
  extraReducers: {}
})

export const { showEditDialogBox, setEditDialogBox, setEditDialogBoxHover, hideEditDialogBox } = dialogBoxSlice.actions

export default dialogBoxSlice.reducer
