import React from 'react'
import { Box, Button, Typography, Card, Grid, TextField, } from '@mui/material'

const Search = () => {
  return (
    //search rentals - textfield

    //NFT Image column
    //NFT Name column
    //Rent button column

    <Grid container item spacing = { 2 }>

      <Grid item>
        <TextField label="Search Rentals"
                    xs={ 12 }
                    sm={ 12 }
                    md={ 12 }
        >

        </TextField>
      </Grid>

      <Grid container columnSpacing = { { xs:4, sm:4, md:4 } }>        
          <Grid item xs={ 4 } sm={ 4 } md={ 4 }>
            <Typography>NFT Image</Typography>
          </Grid>

          <Grid item xs={ 4 } sm={ 4 } md={ 4 }>
            <Typography>NFT description of benefits</Typography>
          </Grid>
          
          <Grid item xs={ 4 } sm={ 4 } md={ 4 }>
            <Button variant="contained"
                  color="success"
            >
              Rent
            </Button>
          </Grid>


          <Grid item xs={ 4 } sm={ 4 } md={ 4 }>
            <Typography>NFT Image</Typography>
          </Grid>
          
          <Grid item xs={ 4 } sm={ 4 } md={ 4 }>
            <Typography>NFT description of benefits</Typography>
          </Grid>
          
          <Grid item xs={ 4 } sm={ 4 } md={ 4 }>
            <Button variant="contained"
                  color="success"
            >
              Rent
            </Button>
          </Grid>

      </Grid>


    </Grid>

  )
}

export default Search