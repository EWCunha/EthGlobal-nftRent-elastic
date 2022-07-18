import React, { useState, useEffect } from 'react'
import { Box, Button, Typography, Grid, TextField, InputAdornment,Card,CardHeader } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import ercInterfaceABI from '../contracts/IERC721.json'
import { ethers } from 'ethers'
import ElasticContractJSON from '../contracts/Elastic.json'
import ElasticLogo from '../img/TestImage.png'

const List = () => {

  const defaultAccount = useSelector((state) => state.defaultAccount)
  const contract = useSelector((state) => state.contract)
  const tempSigner = useSelector((state) => state.signer)
  const contractERC = useSelector((state) => state.ercInterface)

  const [benefits, setBenefits] = useState(null);
  const [rentPerDay, setRentPerDay] = useState(null);
  const [collateralDeposit, setCollateralDeposit] = useState(null);
  const [nFTAddress, setNFTAddress] = useState(null);
  const [tokenId, setTokenId] = useState(null);
  const [approved, setApproved] = useState(false);

  const elasticContractAddress = ElasticContractJSON.address


  useEffect(() => {
    if (ethers.utils.isAddress(nFTAddress)) {
      const contractERC = new ethers.Contract(nFTAddress, ercInterfaceABI.abi, tempSigner)
      dispatch({ type: "SET_ERC_INTERFACE", payload: contractERC })
    }
  }, [nFTAddress])

  useEffect(() => {
    if (defaultAccount && contractERC) {
      checkIfApproved()
    }
  }, [defaultAccount, contractERC])

  const dispatch = useDispatch()

  async function checkIfApproved() {
    const isApproved = await contractERC.isApprovedForAll(defaultAccount, elasticContractAddress)
    setApproved(isApproved)
  }

  const approveOperator = async () => {
    if (!approved) {
      const tx = await contractERC.setApprovalForAll(elasticContractAddress, true)
      await tx.wait(1)
      setApproved(true)
    }
  }

  const listNFT = async (evt) => {
    evt.preventDefault()
    const weiCollateral = ethers.utils.parseEther(collateralDeposit.toString())

    // Storing price per second in WEI
    const weiPrice = ethers.utils.parseEther(rentPerDay.toString()).div(24 * 60 * 60)

    await contract.listNFT(
      nFTAddress,
      tokenId,
      weiPrice,
      weiCollateral,
      benefits
    )
  }

  return (


    defaultAccount ? (  
<Box>
  <center>
  <Card variant="outlined" sx={{ display: 'inline-block', backgroundColor: "white" }}>
  <CardHeader title="LIST AN NFT"/>
           
  <Grid container item spacing={2}>
        <Grid item xs={12} sm={12} md={12}>
          <TextField label="Details benefits"
            variant="outlined"
            onChange={(e) => setBenefits(e.target.value)}
          >
          </TextField>
        </Grid>

        <Grid item xs={12} sm={12} md={12}>
          <TextField label="Rent per day"
            variant="outlined"
            onChange={(e) => setRentPerDay(e.target.value)}
            InputProps={{
              endAdornment: <InputAdornment position="end">ETH</InputAdornment>
            }}
          >
          </TextField>
        </Grid>

        <Grid item xs={12} sm={12} md={12}>
          <TextField label="Collateral deposit"
            variant="outlined"
            onChange={(e) => setCollateralDeposit(e.target.value)}
            InputProps={{
              endAdornment: <InputAdornment position="end">ETH</InputAdornment>
            }}
          >
          </TextField>
        </Grid>

        <Grid item xs={12} sm={12} md={12}>
          <TextField label="NFT address"
            variant="outlined"
            onChange={(e) => setNFTAddress(e.target.value)}
          >
          </TextField>
        </Grid>

        <Grid item xs={12} sm={12} md={12}>
          <TextField label="Token id"
            variant="outlined"
            onChange={(e) => setTokenId(e.target.value)}
          >
          </TextField>
        </Grid>

        <Grid item xs={12} sm={12} md={12}>
          <Box>
            {contractERC ? (approved ? (
              <Button variant="contained"
                color="success"
                onClick={listNFT}
              >
                LIST NFT
              </Button>
            ) : (
              <Button variant="contained"
                color="warning"
                onClick={approveOperator}
              >
                APPROVE
              </Button>
            )) : (
              <Button variant="contained"
                color="error"
              >
                INPUT NFT ADDRESS
              </Button>
            )}

          </Box>
        </Grid>
      </Grid > 
  </Card>
  </center>
</Box>
     

    ) : <div>
      <center>
      <Typography sx={{fontSize:20}}>
      Please connect your wallet to list an NFT.
      </Typography>
      <img width='25%' height='25%' src={ElasticLogo}/>


      </center>
    
      </div>
  )
}

export default List