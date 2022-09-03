import { configureStore } from '@reduxjs/toolkit'
import { draftDataReducer } from './draftData'
import { playerCombinationsReducer } from './playerCombinations'

export const reducer = {
  draftData: draftDataReducer,
  playerCombinations: playerCombinationsReducer,
}

export default configureStore({ reducer })
