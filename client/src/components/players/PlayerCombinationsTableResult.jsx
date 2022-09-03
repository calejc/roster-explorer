import React from 'react'
import {
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { useSelector } from 'react-redux'
import { getPlayerCombinationResults } from '../../state/playerCombinations'
import REQUEST_STATUS from '../../state/apibased/REQUEST_STATUS'

export default function PlayerCombinationsTableResult() {
  const { value, status } = useSelector(getPlayerCombinationResults)

  return (
    <>
      <TableContainer>
        {status === REQUEST_STATUS.FAILED &&
          <Alert severity='error'>Failed to load player combinations data. Please contact your friendly neighborhood developer if this issue persists.</Alert>
        }
        {status !== REQUEST_STATUS.FAILED &&
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Count</TableCell>
                <TableCell>Players</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {status === REQUEST_STATUS.IN_PROGRESS &&
                <TableRow>
                  <TableCell align='center' colSpan={2}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              }
              {status === REQUEST_STATUS.SUCCEEDED &&
                value.map((c, i) => {
                  return <TableRow key={i}>
                    <TableCell>{Object.keys(c)[0]}</TableCell>
                    <TableCell>{c[Object.keys(c)[0]].join(', ')}</TableCell>
                  </TableRow>
                })
              }
            </TableBody>
          </Table>
        }
      </TableContainer>
    </>
  )
}