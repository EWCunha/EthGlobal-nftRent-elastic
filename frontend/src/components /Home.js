import React from 'react'
import { Box, Button, Typography, Card, Grid } from '@mui/material'

const Home = () => {
  return (
    <Grid container item spacing = { 2 }>

      <Grid container item>
        <Typography>
          Welcome to Elastic
        </Typography>
      </Grid>

      <Grid item>
        <Box>
          <Button variant = "contained"
                  color = "success"
          >
            List an NFT
          </Button>
        </Box>
      </Grid>

      <Grid item>
        <Box>
          <Button variant = "contained"
                  color = "warning"
          >
            Rent an NFT
          </Button>
        </Box>
      </Grid>

   

      
    </Grid>
  )
}

export default Home