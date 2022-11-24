// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk, SerializedError } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

// ** Types
import { IScene, IResponse, FetchSceneParamsType } from 'src/types/scene/sceneTypes'

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

// ** Fetch Scenes
export const fetchScenes = createAsyncThunk(
  'scene/fetchScenes',
  async (params: FetchSceneParamsType, { getState }: Redux) => {
    const { scenes } = getState()
    const response = await axios.get('http://localhost:1337/api/scenes', {
      params: Object.assign(
        {
          filter: scenes.filter,
          populate: ['owner'],
          pagination: scenes.pagination
        },
        params
      )
    })

    return response.data as IResponse
  }
)

export const scenesSlice = createSlice({
  name: 'scenes',
  initialState: {
    isLoading: false,
    isError: false,
    error: {} as SerializedError,
    data: [] as IScene[],
    filter: {},
    pagination: {
      page: 1,
      pageSize: 25,
      pageCount: 0,
      total: 0
    }
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchScenes.pending, state => {
      state.isLoading = true
      state.isError = false
      state.error = {}
    }),
      builder.addCase(fetchScenes.fulfilled, (state, action) => {
        state.isLoading = false
        state.isError = false
        state.error = {}
        state.data = action.payload.data
        state.pagination.page = action.payload.meta.pagination.page
        state.pagination.pageSize = action.payload.meta.pagination.pageSize
        state.pagination.pageCount = action.payload.meta.pagination.pageCount
        state.pagination.total = action.payload.meta.pagination.total
      }),
      builder.addCase(fetchScenes.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.error = action.error
        state.data = []
        state.pagination.page = 1
        state.pagination.pageSize = 25
        state.pagination.pageCount = 0
        state.pagination.total = 0
      })
  }
})

export default scenesSlice.reducer
