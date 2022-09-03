import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import createInitialState from "./apibased/createInitialState"
import {
  asyncFulfilledReducer,
  asyncPendingReducer,
  asyncRejectedReducer
} from "./apibased/createDefaultReducersForAsyncThunk"
import getPlayerCombinations from "../api/getPlayerCombinations"

export const PLAYER_COMBINATION_QUERY_PARAMETERS = {
  playerIds: {
    name: 'playerIds',
    action: 'set'
  },
  tournaments: {
    name: 'tournaments',
    action: 'toggle_from_array'
  },
  rounds: {
    name: 'rounds',
    action: 'toggle_from_array'
  },
  positions: {
    name: 'positions',
    action: 'toggle_from_array'
  },
  showAll: {
    name: 'showAll',
    action: 'set'
  }
}

const initialState = {
  data: createInitialState([]),
  parameters: {
    [PLAYER_COMBINATION_QUERY_PARAMETERS.playerIds.name]: {
      action: PLAYER_COMBINATION_QUERY_PARAMETERS.playerIds.action,
      value: [],
    },
    [PLAYER_COMBINATION_QUERY_PARAMETERS.tournaments.name]: {
      action: PLAYER_COMBINATION_QUERY_PARAMETERS.tournaments.action,
      value: []
    },
    [PLAYER_COMBINATION_QUERY_PARAMETERS.rounds.name]: {
      action: PLAYER_COMBINATION_QUERY_PARAMETERS.rounds.action,
      value: []
    },
    [PLAYER_COMBINATION_QUERY_PARAMETERS.positions.name]: {
      action: PLAYER_COMBINATION_QUERY_PARAMETERS.positions.action,
      value: ['QB', 'RB', 'WR', 'TE']
    },
    [PLAYER_COMBINATION_QUERY_PARAMETERS.showAll.name]: {
      action: PLAYER_COMBINATION_QUERY_PARAMETERS.showAll.action,
      value: false
    }
  }
}

export const fetchPlayerCombinationCounts = createAsyncThunk(
  'playerCombinations/fetch',
  async (_, { getState }) => {
    return await getPlayerCombinations(getState().playerCombinations.parameters)
  }
)

const extraReducers = {
  [fetchPlayerCombinationCounts.pending]: (state) => {
    asyncPendingReducer(state.data)
  },
  [fetchPlayerCombinationCounts.fulfilled]: (state, action) => {
    asyncFulfilledReducer(state.data, action)
  },
  [fetchPlayerCombinationCounts.rejected]: (state, action) => {
    asyncRejectedReducer(state.data, action)
  }
}

const playerCombinationsSlice = createSlice({
  name: 'playerCombinations',
  initialState,
  reducers: {
    setParameter(state, action) {
      const param = state.parameters[action.payload.key]
      switch (param.action) {
        case 'set':
          param.value = action.payload.value
          break
        case 'toggle_from_array':
          let isInitialDefaultArrayValue = typeof action.payload.value !== 'string'
          if (isInitialDefaultArrayValue) {
            param.value = action.payload.value
          } else {
            let copyOfState = param.value.slice()
            const isAlreadyPresent = param.value.indexOf(action.payload.value) > -1
            if (isAlreadyPresent) {
              copyOfState = copyOfState.filter(i => i != action.payload.value)
            } else {
              copyOfState.push(action.payload.value)
            }
            param.value = copyOfState
          }
          break
      }
    },
    clearResults(state) {
      state.data.value = []
    }
  },
  extraReducers: extraReducers
})

export const setPlayerCombinationsQueryParameter = (key, value) => playerCombinationsSlice.actions.setParameter({ key, value })
export const clearCombinationResults = () => playerCombinationsSlice.actions.clearResults()
export const getPlayerCombinationQueryParameters = state => state.playerCombinations.parameters
export const getPlayerCombinationResults = state => state.playerCombinations.data
export const playerCombinationsReducer = playerCombinationsSlice.reducer