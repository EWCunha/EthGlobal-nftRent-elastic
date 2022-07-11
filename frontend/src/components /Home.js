import React from 'react'
import { Box, Button, Typography, Card, Grid } from '@mui/material'
import { Link } from 'react-router-dom'
import Rent from './Rent'
import ElasticLogo from '../img/TestImage.png'

const Home = () => {
  return (
    <Grid container item spacing = { 2 }>

      <Grid container item>
        <Typography>
          Welcome to Elastic!
        </Typography>
       
      </Grid>
      <img width='50%' height='50%' src={ElasticLogo}/>
      <Grid item>
        <Box>
            <Link to='List'>
            <Button variant = "contained"
                  color = "success"
          >
            List an NFT
          </Button>
            </Link>
        </Box>
      </Grid>

      <Grid item>
        <Box>
            <Link to='Rent'>
            <Button variant = "contained"
                  color = "warning"
          >
            Rent an NFT
          </Button>
            </Link>
       
        </Box>
      </Grid>

   

      
    </Grid>
  )
}

export default Home