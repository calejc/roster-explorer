import { Grid } from '@mui/material'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadDraftDataForUser } from '../../state/draftData'
import { setPlayerCombinationsQueryParameter } from '../../state/playerCombinations'
import PlayerCombinationsTableForm from './PlayerCombinationsTableForm'
import PlayerCombinationsTableResult from './PlayerCombinationsTableResult'

export default function PlayerCombinationsTable() {
  const dispatch = useDispatch()
  const { status, playerList, tournaments } = useSelector(state => state.draftData)

  useEffect(() => {
    dispatch(loadDraftDataForUser())
  }, [])

  useEffect(() => {
    dispatch(setPlayerCombinationsQueryParameter("tournaments", tournaments))
  }, [playerList])


  return (
    <>
      <Grid container alignItems='center' justifyItems='center' p={3}>
        <PlayerCombinationsTableForm />
      </Grid>
      <Grid container alignItems='center' justifyItems='center' p={2}>
        <PlayerCombinationsTableResult />
      </Grid>
    </>
  )
}