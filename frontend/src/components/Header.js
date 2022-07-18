import React from 'react'
import { Link } from 'react-router-dom'
import Web3Connect from './Web3Connect'
import { useSelector, useDispatch } from 'react-redux'
import ThreeSixtyIcon from '@mui/icons-material/ThreeSixty';

import {
  AppBar,
  Toolbar,
  CssBaseline,
  Typography,
  IconButton,
  Box,
  Button,
} from '@mui/material'
import { flexbox } from '@mui/system'
import { green } from '@mui/material/colors'



const Header = () => {

  const defaultAccount = useSelector((state) => state.defaultAccount)

  return (
    <>
      <AppBar position="static" sx={{ marginBottom:2, }}>
        <CssBaseline />
        <Toolbar>
          <IconButton component={Link}
          to="/"
          >
            <ThreeSixtyIcon sx={{color:'white',fontSize:'200%'}}/>
            <Typography variant="h4" color="white">
              Elastic 
            </Typography>
          </IconButton> 
 
          <Box 
            sx={{
              width: "50%",
              mx: "auto",
              bgcolor: "none",
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center"
            }}>
            <Button component={Link}
            to="/"
            >
              <Typography sx={{ color: "white" }}>
                Home
              </Typography>
            </Button>
            <Button component={Link}
            to="/List"
            >
              <Typography sx={{ color: "white" }}>
                List
              </Typography>
            </Button> 
            <Button component={Link}
            to="/Search"
            >
              <Typography sx={{ color: "white" }}>
                Search
              </Typography>
            </Button>

            {
              defaultAccount ? 
              <Button component={Link}
              to="/Dashboard"
              >
                <Typography sx={{ color: "white" }}>
                  Dashboard
                </Typography>
              </Button> : null
            }
          </Box>
          
          <Web3Connect/>
               
        </Toolbar>
      </AppBar>
    </>
  )
}

export default Header