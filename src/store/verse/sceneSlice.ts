// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Actions Imports
import { hideDialogBox } from './dialogBoxSlice'

// ** Axios Imports
import axios from 'axios'

// ** Lodash Imports
import _ from 'lodash'

// ** Types
import { RootState } from 'src/store'
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

export const patchSceneMetadata = createAsyncThunk(
  'verse/patchSceneMetadata',
  async (newSceneMetadata, { getState }) => {
    const enhancedSceneMetadata = _.omitBy(newSceneMetadata, _.isNil)

    const {
      data: { data }
    } = await axios.put(`/api/scenes/${(getState() as RootState).verse.scene.id}`, {
      data: {
        ...enhancedSceneMetadata
      }
    })
    const { attributes } = data

    return attributes
  }
)

export const patchSceneBanner = createAsyncThunk('verse/patchSceneBanner', async (newBannerFormData, { getState }) => {
  const { data: bannerData } = await axios.post('/upload', newBannerFormData)
  const newBannerId = bannerData?.[0].id

  const {
    data: { data }
  } = await axios({
    method: 'PUT',
    url: `/api/scenes/${(getState() as RootState).verse.scene.id}`,
    data: {
      data: {
        banner: newBannerId
      },
      populate: '*'
    }
  })

  const {
    attributes: { banner }
  } = data

  return banner
})

export const patchSceneFrame = createAsyncThunk(
  'verse/patchSceneFrame',
  async ({ nftFrameId, nftMetadata }, { dispatch, getState }) => {
    const worldInstance = (getState() as RootState).verse.scene.worldInstance
    const currentNftList = (getState() as RootState).verse.scene.nftList
    const newNftMetadata = _.clone(nftMetadata)
    let isInserted = false
    let enhancedNftList = []

    enhancedNftList = currentNftList.map(nftData => {
      if (nftData.frameId === nftFrameId) {
        isInserted = true

        return {
          ...nftData,
          ...newNftMetadata
        }
      } else {
        return nftData
      }
    })

    if (!isInserted) {
      enhancedNftList.push(newNftMetadata)
    }

    await axios.put(`/api/scenes/${(getState() as RootState).verse.scene.id}`, {
      data: {
        nftList: enhancedNftList
      }
    })

    dispatch(hideDialogBox())

    if (worldInstance?.updateNftFrame) {
      worldInstance.updateNftFrame(nftFrameId, {
        type: newNftMetadata.type,
        displayURL: newNftMetadata.displayURL
      })
    }

    return enhancedNftList
  }
)

export const patchSceneAllowedVisitors = createAsyncThunk(
  'verse/patchSceneAllowedVisitors',
  async (newAllowedVisitors, { getState }) => {
    await axios.put(`/api/scenes/${(getState() as RootState).verse.scene.id}`, {
      data: {
        allowedVisitors: newAllowedVisitors
      }
    })

    return newAllowedVisitors
  }
)

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
  name: 'verse/scene',
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

      const newURL = new URL(window.location)
      newURL.searchParams.delete('scene')
      window.history.pushState({}, '', newURL)
    })

    builder.addCase(patchSceneMetadata.pending, state => {
      state.loading = true
    })
    builder.addCase(patchSceneMetadata.fulfilled, (state, action) => {
      state.loading = false
      if (action.payload.displayName) {
        state.displayName = action.payload.displayName
      }
      if (action.payload.description) {
        state.description = action.payload.description
      }
    })
    builder.addCase(patchSceneMetadata.rejected, state => {
      state.loading = false
    })

    builder.addCase(patchSceneBanner.pending, state => {
      state.loading = true
    })
    builder.addCase(patchSceneBanner.fulfilled, (state, action) => {
      state.loading = false
      state.banner = action.payload
    })
    builder.addCase(patchSceneBanner.rejected, state => {
      state.loading = false
      state.banner = null
    })

    builder.addCase(patchSceneFrame.pending, state => {
      state.loading = true
    })
    builder.addCase(patchSceneFrame.fulfilled, (state, action) => {
      state.loading = false
      state.nftList = action.payload
    })
    builder.addCase(patchSceneFrame.rejected, state => {
      state.loading = false
    })

    // builder.addCase(patchSceneAllowedVisitors.pending, state => {
    //   state.loading = true
    // })
    // builder.addCase(patchSceneAllowedVisitors.fulfilled, (state, action) => {
    //   state.loading = false
    //   state.allowedVisitors = action.payload
    // })
    // builder.addCase(patchSceneAllowedVisitors.rejected, state => {
    //   state.loading = false
    // })
  }
})

export const { setWorldInstance } = sceneSlice.actions

export default sceneSlice.reducer
