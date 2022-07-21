import React from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
} from '@mui/material'

const Footer = () => {
  return (
    <AppBar position="" sx={{bgcolor: "red"}} >
      <Container maxWidth="md">

        <Toolbar sx={{ justifyContent: 'center' }}>


          <Typography color="white">
            HackFS ETHGlobal Hackathon 2022
          </Typography>
        </Toolbar>

      </Container>
    </AppBar>
  )
}

export default Footer