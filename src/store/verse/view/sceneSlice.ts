// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

// ** Lodash Imports
import _ from 'lodash'

// ** Types
import { World } from 'src/views/verse/book/world/World'

interface IState {
  loaded: boolean
  loading: boolean
  worldInstance: World | undefined
  id: string
  sceneId: string
  banner: any
  owner: string
  displayName: string
  description: string
  worldScenePaths: string[]
  nftList: any[]
  allowedVisitors: string[]
}

// ** Fetch Scene
export const fetchSceneMetadata = createAsyncThunk('verse/fetchSceneMetadata', async sceneId => {
  const {
    data: { data }
  } = await axios({
    method: 'GET',
    url: `/api/scenes`,
    params: {
      filters: {
        sceneId: {
          $eq: sceneId
        }
      },
      populate: '*'
    }
  })
  const { id, attributes: entity } = data[0]

  return _.assign(
    _.pick(entity, [
      'sceneId',
      'banner',
      'owner',
      'displayName',
      'description',
      'worldScenePaths',
      'nftList',
      'allowedVisitors'
    ]),
    {
      id
    }
  )
})

const initialState: IState = {
  loaded: false,
  loading: false,
  worldInstance: undefined,
  id: '',
  sceneId: '',
  banner: null,
  owner: '',
  displayName: '',
  description: '',
  worldScenePaths: [],
  nftList: [],
  allowedVisitors: []
}

const sceneSlice = createSlice({
  name: 'verse/view/scene',
  initialState,
  reducers: {
    setWorldInstance: (state, action) => {
      state.worldInstance = action.payload
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchSceneMetadata.pending, state => {
      state.loading = true
    })
    builder.addCase(fetchSceneMetadata.fulfilled, (state, action) => {
      state.loaded = true
      state.loading = false
      state.id = action.payload.id
      state.sceneId = action.payload.sceneId
      state.banner = action.payload.banner
      state.owner = action.payload.owner?.toLowerCase()
      state.displayName = action.payload.displayName
      state.description = action.payload.description
      state.worldScenePaths = action.payload.worldScenePaths
      state.nftList = action.payload.nftList
      state.allowedVisitors = action.payload.allowedVisitors
    })
    builder.addCase(fetchSceneMetadata.rejected, state => {
      state.loaded = false
      state.loading = false
      state.id = ''
      state.sceneId = ''
      state.banner = null
      state.owner = ''
      state.displayName = ''
      state.description = ''
      state.worldScenePaths = []
      state.nftList = []
      state.allowedVisitors = []

      const newURL = new URL(window.location.href)
      newURL.searchParams.delete('scene')
      window.history.pushState({}, '', newURL)
    })
  }
})

export const { setWorldInstance } = sceneSlice.actions

export default sceneSlice.reducer
