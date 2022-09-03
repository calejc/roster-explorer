import { AppBar, Container, Toolbar, Button } from '@mui/material'
import { NavLink } from 'react-router-dom'
import React from 'react'

export default function AppMenu() {

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Button color="inherit" component={NavLink} to='/'>
              Home
            </Button>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  )
}