// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** Lodash Imports

// ** Types
import { World } from 'src/views/verse/book/world/EditWorld'

interface IState {
  worldInstance: World | undefined
}

const initialState: IState = {
  worldInstance: undefined
}

const sceneSlice = createSlice({
  name: 'verse/edit/scene',
  initialState,
  reducers: {
    setWorldInstance: (state, action) => {
      state.worldInstance = action.payload
    }
  }
})

export const { setWorldInstance } = sceneSlice.actions

export default sceneSlice.reducer
