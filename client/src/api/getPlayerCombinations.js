import axios from "./config/axios"

const getPlayerCombinations = (parameters) => axios
  .get('/players/combinations',
    {
      params: {
        playerIds: parameters.playerIds.value.join(','),
        tournaments: parameters.tournaments.value.join(','),
        positions: parameters.positions.value.join(',')
      }
    }
  ).then(r => r.data)

export default getPlayerCombinations