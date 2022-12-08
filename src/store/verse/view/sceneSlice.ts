// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** Types
import { World } from 'src/views/verse/book/world/World'

interface IState {
  worldInstance: World | undefined
}

const initialState: IState = {
  worldInstance: undefined
}

const sceneSlice = createSlice({
  name: 'verse/view/scene',
  initialState,
  reducers: {
    setWorldInstance: (state, action) => {
      state.worldInstance = action.payload
    }
  }
})

export const { setWorldInstance } = sceneSlice.actions

export default sceneSlice.reducer
