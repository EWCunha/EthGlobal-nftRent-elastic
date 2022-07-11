import React from 'react'
import { Box, Button, Typography, Card, Grid, TextField } from '@mui/material'
import MockNFT from '../img/TestImage.png'
import { Link } from 'react-router-dom'

const Search = () => {
  return (
    //search rentals - textfield

    //NFT Image column
    //NFT Name column
    //Rent button column

    <Grid container item spacing = { 2 }>

      <Grid item sx={{marginBottom:2}}>
        <TextField label="Search Rentals"
                    xs={ 12 }
                    sm={ 12 }
                    md={ 12 }
        >

        </TextField>
      </Grid>

      <Grid container columnSpacing = { { xs:4, sm:4, md:4 } }>        
          <Grid item xs={ 4 } sm={ 4 } md={ 4 }>
        
                <img width='50%' height='50%' src={MockNFT}/>
          
          </Grid>

          <Grid item xs={ 4 } sm={ 4 } md={ 4 }>
            <Typography>NFT description of benefits</Typography>
          </Grid>
          
          <Grid item xs={ 4 } sm={ 4 } md={ 4 }>
          <Link to='/Rent'>
            <Button variant="contained"
                  color="success"
            >
              Rent
            </Button>
            </Link>
         
          </Grid>


          <Grid item xs={ 4 } sm={ 4 } md={ 4 }>
          <img width='50%' height='50%' src={MockNFT}/>
          </Grid>
          
          <Grid item xs={ 4 } sm={ 4 } md={ 4 }>
            <Typography>NFT description of benefits</Typography>
          </Grid>
          
          <Grid item xs={ 4 } sm={ 4 } md={ 4 }>

            <Link to="/Rent">
            <Button variant="contained"
                  color="success"
            >
              Rent
            </Button>
            </Link>
          
          </Grid>

      </Grid>


    </Grid>

  )
}

export default Search