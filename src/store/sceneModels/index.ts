// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios, { AxiosError } from 'axios'

// ** Types
import { IScene, IResponse, FetchSceneParamsType } from 'src/types/scene/sceneTypes'

const defaultParams = {
  populate: '*',
  pagination: { page: 1 }
}

// ** Fetch Scenes
export const fetchScenes = createAsyncThunk(
  'scene/fetchScenes',
  async (params: FetchSceneParamsType = defaultParams) => {
    const response = await axios.get('http://localhost:1337/api/scenes', {
      params
    })

    return response.data as IResponse
  }
)

export const sceneModelsSlice = createSlice({
  name: 'sceneModels',
  initialState: {
    isLoading: false,
    isError: false,
    error: {},
    data: [] as IScene[],
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
        state.error = (action.payload as { error: AxiosError }).error
        state.data = []
        state.pagination.page = 1
        state.pagination.pageSize = 25
        state.pagination.pageCount = 0
        state.pagination.total = 0
      })
  }
})

export default sceneModelsSlice.reducer
