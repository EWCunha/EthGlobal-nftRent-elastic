import React from 'react'
import { Box, Button, Typography, Card, Grid, TextField } from '@mui/material'

const List = () => {
  return (

    <Grid container item spacing = { 2 }>

      <Grid container item xs={ 12 } sm={ 12 } md={ 12 }>
        <Typography>
          LIST AN NFT
        </Typography>
      </Grid>

      <Grid item xs={ 12 } sm={ 12 } md={ 12 }>
        <TextField label="details benefits"
                  variant="outlined"        
        >
        </TextField>

      </Grid>

      <Grid item xs={ 12 } sm={ 12 } md={ 12 }>
        <TextField label="rent per day"
                  variant="outlined"        
        >
        </TextField>
      </Grid>

      <Grid item xs={ 12 } sm={ 12 } md={ 12 }>
      <TextField label="collateral deposit"
                  variant="outlined"        
        >
        </TextField>
      </Grid>

      <Grid item xs={ 12 } sm={ 12 } md={ 12 }>
        <Box>
          <Button variant="contained"
                  color="error"
          >LIST NFT
          </Button>
        </Box>
      
      </Grid>

   

      
    </Grid>
    //title: list an nft
    //3 fields for data input
      //details
      //rent per day
      //collateral deposit
    //button that says list nft (red) - round
  )
}

export default List