import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import {
  asyncPendingReducer,
  asyncRejectedReducer
} from "./apibased/createDefaultReducersForAsyncThunk"
import fetchDraftData from "../api/fetchDraftData"
import REQUEST_STATUS from "./apibased/REQUEST_STATUS"

const initialState = {
  tournaments: [],
  playerList: [],
  error: null,
  status: REQUEST_STATUS.NOT_STARTED
}

export const loadDraftDataForUser = createAsyncThunk(
  'draftData/fetch',
  async () => await fetchDraftData()
)

const extraReducers = {
  [loadDraftDataForUser.pending]: (state) => {
    asyncPendingReducer(state)
  },
  [loadDraftDataForUser.fulfilled]: (state, action) => {
    state.status = REQUEST_STATUS.SUCCEEDED
    state.tournaments = action.payload.tournaments
    state.playerList = action.payload.playerList
  },
  [loadDraftDataForUser.rejected]: (state, action) => {
    asyncRejectedReducer(state, action)
  }
}

const draftDataSlice = createSlice({
  name: 'draftData',
  initialState,
  reducers: {},
  extraReducers: extraReducers
})

export const getTournaments = state => state.draftData.tournaments
export const draftDataReducer = draftDataSlice.reducer