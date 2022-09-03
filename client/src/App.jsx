import { Container } from '@mui/material'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AppMenu from './components/header/AppMennu'
import PlayerCombinationsTable from './components/players/PlayerCombinationsTable'

export default function App() {
  return (
    <>
      <AppMenu />
      <Container maxWidth='md'>
        <Routes>
          <Route path='/' element={<PlayerCombinationsTable />} />
        </Routes>
      </Container>
    </>
  )
}
