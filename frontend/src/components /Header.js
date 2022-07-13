import React from 'react'
import { Link } from 'react-router-dom'
import Web3Connect from './Web3Connect'

import {
  AppBar,
  Toolbar,
  CssBaseline,
  Typography,
  IconButton
} from '@mui/material'



const Header = () => {

  return (
    <>
      <AppBar position="static" sx={{marginBottom:2}}>
        <CssBaseline />
        <Toolbar>
          <IconButton href="/">
            <Typography variant="h4" color="white">
              Elastic 
            </Typography>
          </IconButton> 
 
          <div>
            <Link to="/">
              Home
            </Link>
            <Link to="/List">
              List
            </Link> 
            <Link to="/Search">
              Search
            </Link>
      
            <Web3Connect/>
          </div>      
 
        </Toolbar>
      </AppBar>
    </>
  )
}

export default Header