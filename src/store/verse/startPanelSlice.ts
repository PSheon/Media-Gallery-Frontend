import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  show: false,
  title: '',
  content: '',
  confirmButtonText: '',
  closeCallback: () => undefined
}

const startPanelSlice = createSlice({
  name: 'verse/startPanel',
  initialState,
  reducers: {
    showStartPanel: state => {
      state.show = true
    },
    setStartPanel: (state, action) => {
      state.title = action.payload.title
      state.content = action.payload.content
      state.confirmButtonText = action.payload.confirmButtonText
      state.closeCallback = action.payload.closeCallback
    },
    hideStartPanel: state => {
      state.show = false
    }
  },
  extraReducers: {}
})

export const { showStartPanel, setStartPanel, hideStartPanel } = startPanelSlice.actions

export default startPanelSlice.reducer
