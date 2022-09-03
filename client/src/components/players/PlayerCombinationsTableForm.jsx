import React, { useEffect, useState } from 'react'
import {
  Autocomplete,
  CircularProgress,
  Grid,
  IconButton,
  TextField
} from '@mui/material'
import {
  clearCombinationResults,
  fetchPlayerCombinationCounts,
  getPlayerCombinationQueryParameters,
  PLAYER_COMBINATION_QUERY_PARAMETERS,
  setPlayerCombinationsQueryParameter
} from '../../state/playerCombinations'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import { useDispatch, useSelector } from 'react-redux'
import PlayerCombinationsTableFormFilterMenu from './PlayerCombinationsTableFormFilterMenu'
import REQUEST_STATUS from '../../state/apibased/REQUEST_STATUS'

export default function PlayerCombinationsTableForm() {
  const dispatch = useDispatch()
  const { status, playerList } = useSelector(state => state.draftData)
  const parameters = useSelector(getPlayerCombinationQueryParameters)

  const [filterMenuAnchorEl, setFilterMenuAnchorEl] = useState()
  const filterMenuOpen = Boolean(filterMenuAnchorEl)


  useEffect(() => {
    if (parameters.playerIds.value.length > 0) {
      dispatch(fetchPlayerCombinationCounts())
    }
  }, [parameters])

  const isLoading = () => {
    return (status === REQUEST_STATUS.NOT_STARTED || status === REQUEST_STATUS.IN_PROGRESS) && playerList.length === 0
  }

  const onPlayerSelect = (e, v) => {
    dispatch(
      setPlayerCombinationsQueryParameter(
        PLAYER_COMBINATION_QUERY_PARAMETERS.playerIds.name,
        v.map(p => p.id) ?? []
      )
    )
    if (!v.length) {
      dispatch(clearCombinationResults())
    }
  }

  return (playerList &&
    <>
      <Grid item xs={8}>
        <Autocomplete
          multiple
          options={playerList}
          disablePortal
          loading={isLoading()}
          loadingText={<CircularProgress />}
          onChange={onPlayerSelect}
          getOptionLabel={(option) => `${option.first} ${option.last}`}
          renderInput={(params) => <TextField {...params} label='Player' />}
        />
      </Grid>
      <Grid item xs={4}>
        <IconButton
          aria-controls='filter-menu'
          color='inherit'
          aria-label='filter'
          size='medium'
          onClick={(e) => setFilterMenuAnchorEl(e.currentTarget)}
        >
          <FilterAltIcon />
        </IconButton>
        <PlayerCombinationsTableFormFilterMenu
          anchorEl={filterMenuAnchorEl}
          open={filterMenuOpen}
          onClose={() => setFilterMenuAnchorEl(null)}
        />
      </Grid>
    </>
  )
}