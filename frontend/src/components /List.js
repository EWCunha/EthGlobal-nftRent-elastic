import React, { useState, useEffect } from 'react'
import { Box, Button, Typography, Card, Grid, TextField } from '@mui/material'
import { useDispatch } from 'react-redux'

const List = () => {

  const [benefits, setBenefits] = useState(null);
  const [rentPerDay, setRentPerDay] = useState(null);
  const [collateralDeposit, setCollateralDeposit] = useState(null);

  useEffect (() => {
    if (benefits){
      console.log(benefits);
    }
  },[benefits])

  useEffect (() => {
    if (rentPerDay){
      console.log(rentPerDay);
    }
  },[rentPerDay])

  useEffect (() => {
    if (collateralDeposit){
      console.log(collateralDeposit);
    }
  },[collateralDeposit])

  const dispatch = useDispatch()

  const listNFT= () => {
    dispatch({type:"ENTER_DESCRIPTION", payload:benefits})
  }

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
                  onChange={(e) => setBenefits(e.target.value)}        
        >
        </TextField>

      </Grid>

      <Grid item xs={ 12 } sm={ 12 } md={ 12 }>
        <TextField label="rent per day"
                  variant="outlined"
                  onChange={(e) => setRentPerDay(e.target.value)}         
        >
        </TextField>
      </Grid>

      <Grid item xs={ 12 } sm={ 12 } md={ 12 }>
      <TextField label="collateral deposit"
                  variant="outlined"
                  onChange={(e) => setCollateralDeposit(e.target.value)}         
        >
        </TextField>
      </Grid>

      <Grid item xs={ 12 } sm={ 12 } md={ 12 }>
        <Box>
          <Button variant="contained"
                  color="error"
                  onClick={listNFT}
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