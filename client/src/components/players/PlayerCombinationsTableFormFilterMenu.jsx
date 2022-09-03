import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  ListSubheader,
  Menu,
  MenuItem,
  MenuList,
} from '@mui/material'
import { getPlayerCombinationQueryParameters, PLAYER_COMBINATION_QUERY_PARAMETERS, setPlayerCombinationsQueryParameter } from '../../state/playerCombinations'
import { getTournaments } from '../../state/draftData'

const POSITIONS = ['QB', 'RB', 'WR', 'TE']

export default function PlayerCombinationsTableFormFilterMenu({ anchorEl, open, onClose }) {
  const dispatch = useDispatch()
  const parameters = useSelector(getPlayerCombinationQueryParameters)
  const availabledTournamentOptions = useSelector(getTournaments)

  const onParamChange = key => e => {
    dispatch(setPlayerCombinationsQueryParameter(key, e.target.name))
  }

  return (
    <>
      <Menu
        id='filter-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
      >
        <MenuList>
          <ListSubheader>Filter Options</ListSubheader>
          <Divider />
          <MenuItem>Tournaments</MenuItem>
          <Box pl={4}>
            <FormGroup>
              {availabledTournamentOptions.map(t =>
                <FormControlLabel
                  key={t}
                  label={t}
                  control={
                    <Checkbox
                      size='small'
                      checked={parameters.tournaments.value.includes(t)}
                      name={t}
                      onChange={onParamChange(PLAYER_COMBINATION_QUERY_PARAMETERS.tournaments.name)}
                    />
                  }
                />
              )}
            </FormGroup>
          </Box>
          <MenuItem>Positions</MenuItem>
          <Box pl={4}>
            <FormGroup>
              {POSITIONS.map(t =>
                <FormControlLabel
                  key={t}
                  label={t}
                  control={
                    <Checkbox
                      size='small'
                      checked={parameters.positions.value.includes(t)}
                      name={t}
                      onChange={onParamChange(PLAYER_COMBINATION_QUERY_PARAMETERS.positions.name)}
                    />
                  }
                />
              )}
            </FormGroup>
          </Box>
        </MenuList>
      </Menu>
    </>
  )
}