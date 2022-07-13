import React, { useState, useEffect } from 'react'
import { Box, Button, Typography, Card, Grid, TextField } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'

const List = () => {

  const defaultAccount = useSelector((state) => state.defaultAccount)
  const contract = useSelector((state) => state.contract)

  const [benefits, setBenefits] = useState(null);
  const [rentPerDay, setRentPerDay] = useState(null);
  const [collateralDeposit, setCollateralDeposit] = useState(null);
  const [nFTAddress, setNFTAddress] = useState(null);
  const [tokenId, setTokenId] = useState(null);

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

  useEffect (() => {
    if (nFTAddress){
      console.log(nFTAddress);
    }
  },[nFTAddress])

  useEffect (() => {
    if (tokenId){
      console.log(tokenId);
    }
  },[tokenId])

  const dispatch = useDispatch()

  const listNFT= () => {
    contract.listNFT(
      nFTAddress,
       tokenId,
       rentPerDay,
       collateralDeposit,
       benefits
      )
  }

  return (

    
     defaultAccount ? (
      
      <Grid container item spacing = { 2 }>

        <Grid container item xs={ 12 } sm={ 12 } md={ 12 }>
          <Typography>
            LIST AN NFT
          </Typography>
        </Grid>

        <Grid item xs={ 12 } sm={ 12 } md={ 12 }>
          <TextField label="Details benefits"
          variant="outlined"
          onChange={(e) => setBenefits(e.target.value)}        
          >
          </TextField>
        </Grid>

        <Grid item xs={ 12 } sm={ 12 } md={ 12 }>
          <TextField label="Rent per day"
          variant="outlined"
          onChange={(e) => setRentPerDay(e.target.value)}         
          >
          </TextField>
        </Grid>

        <Grid item xs={ 12 } sm={ 12 } md={ 12 }>
          <TextField label="Collateral deposit"
          variant="outlined"
          onChange={(e) => setCollateralDeposit(e.target.value)}         
          >
          </TextField>
        </Grid>

        <Grid item xs={ 12 } sm={ 12 } md={ 12 }>
          <TextField label="NFT address"
          variant="outlined"
          onChange={(e) => setNFTAddress(e.target.value)}        
          >
          </TextField>
        </Grid>

        <Grid item xs={ 12 } sm={ 12 } md={ 12 }>
          <TextField label="Token id"
          variant="outlined"
          onChange={(e) => setTokenId(e.target.value)}        
          >
          </TextField>
        </Grid>

        <Grid item xs={ 12 } sm={ 12 } md={ 12 }>
          <Box>
            <Button variant="contained"
              color="error"
              onClick={listNFT}
            >
              LIST NFT
            </Button>
          </Box>
        </Grid>

      </Grid>

    ) : <div>Please connect your wallet to list an NFT.</div>
  )
}

export default List