import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  percentage: 0,
  content: 'Loading Scene...'
}

const loadingScreenSlice = createSlice({
  name: 'verse/loadingScreen',
  initialState,
  reducers: {
    setLoadingProgress: (state, action) => {
      state.percentage = action.payload.percentage
      state.content = action.payload.content
    }
  },
  extraReducers: {}
})

export const { setLoadingProgress } = loadingScreenSlice.actions

export default loadingScreenSlice.reducer
