// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** Types
import { IInitialState } from 'src/types/verse/edit/loadingScreenTypes'

const initialState: IInitialState = {
  percentage: 0,
  content: 'Loading Scene...'
}

const loadingScreenSlice = createSlice({
  name: 'verse/edit/loadingScreen',
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
