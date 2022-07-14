import React, { useState, useEffect } from 'react'
import { Box, Button, Typography, Card, Grid, TextField } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import ercInterfaceABI from '../contracts/ERC721.json'
import { ethers } from 'ethers'
import ElasticContractJSON from '../contracts/Elastic.json'
const List = () => {

  const defaultAccount = useSelector((state) => state.defaultAccount)
  const contract = useSelector((state) => state.contract)
  const tempSigner = useSelector((state)=> state.signer)
  const interfaceERC = useSelector((state)=> state.ercInterface)

  const [benefits, setBenefits] = useState(null);
  const [rentPerDay, setRentPerDay] = useState(null);
  const [collateralDeposit, setCollateralDeposit] = useState(null);
  const [nFTAddress, setNFTAddress] = useState(null);
  const [tokenId, setTokenId] = useState(null);

  const elasticContractAddress = ElasticContractJSON.address

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
    console.log(nFTAddress);
    if (ethers.utils.isAddress(nFTAddress)){
      console.log("CONTRACT ADDRESS DETECTED")   
      try{   
        const interfaceERC = new ethers.Contract(nFTAddress, ercInterfaceABI.abi, tempSigner)
        dispatch({type:"SET_ERC_INTERFACE",payload: interfaceERC})
        }
      catch{
        alert("contract object for interface not made")
        }    
  }
}
,[nFTAddress])

  useEffect (() => {
    if (tokenId){
      console.log(tokenId);
    }
  },[tokenId])

  const dispatch = useDispatch()



  const listNFT= async () => {
    console.log("ELASTIC CONTRACT:", elasticContractAddress)
   //isApprovedForAll(address owner, address operator)
   //Returns if the operator is allowed to manage all of the assets of owner.
    if(await interfaceERC.isApprovedForAll(nFTAddress,elasticContractAddress)){
      console.log("approved- about to list...")
      await contract.listNFT(
       nFTAddress,
       tokenId,
       rentPerDay,
       collateralDeposit,
       benefits
      )
    }
    else{
      try{
        console.log("not approved- so getting approval...")

      await interfaceERC.setApprovalForAll(elasticContractAddress,true)
  
      await contract.listNFT(
        nFTAddress,
        tokenId,
        rentPerDay,
        collateralDeposit,
        benefits
       )

      }
      catch{
        alert("Approval could not be set")
      }

    }
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