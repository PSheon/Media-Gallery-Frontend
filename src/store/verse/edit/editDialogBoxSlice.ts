// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** Types
import { IInitialState } from 'src/types/verse/edit/dialogBoxTypes'

const initialState: IInitialState = {
  show: false,
  hover: false
}

const dialogBoxSlice = createSlice({
  name: 'verse/edit/dialogBox',
  initialState,
  reducers: {
    showEditDialogBox: state => {
      state.show = true
    },
    setEditDialogBox: state => {
      state.hover = true
    },
    setEditDialogBoxHover: (state, action) => {
      state.hover = action.payload
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
