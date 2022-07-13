import React from 'react'
import { Link } from 'react-router-dom'
import Web3Connect from './Web3Connect'
import { useSelector, useDispatch } from 'react-redux'

import {
  AppBar,
  Toolbar,
  CssBaseline,
  Typography,
  IconButton
} from '@mui/material'



const Header = () => {

  const defaultAccount = useSelector((state) => state.defaultAccount)

  return (
    <>
      <AppBar position="static" sx={{marginBottom:2}}>
        <CssBaseline />
        <Toolbar>
          <IconButton component={Link}
          to="/"
          >
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

            {
              defaultAccount ? 
              <Link to="/Dashboard">
                Dashboard
              </Link> : null
            }
      
            <Web3Connect/>
          </div>      
 
        </Toolbar>
      </AppBar>
    </>
  )
}

export default Header