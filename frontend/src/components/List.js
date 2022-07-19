import React, { useState, useEffect } from 'react'
import { Box, 
  Button, 
  Typography, 
  Grid, 
  TextField, 
  InputAdornment, 
  Card, 
  CardHeader, 
  Snackbar,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';

import { useDispatch, useSelector } from 'react-redux'
import ercInterfaceABI from '../contracts/IERC721.json'
import { ethers } from 'ethers'
import ElasticContractJSON from '../contracts/Elastic.json'
import ElasticLogo from '../img/TestImage.png'
import { useNavigate } from "react-router-dom";

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
  const [processing, setProcessing] = useState(false);

  const [openListingSnackbar, setOpenListingSnackbar] = useState(false)

  const elasticContractAddress = ElasticContractJSON.address
  
  const navigate = useNavigate()

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

  useEffect(() => {
    if (approved) {
      setProcessing(false)
    }
  },[approved])

  useEffect(() => {
    if(openListingSnackbar) {
      setProcessing(false)
    }
  },[openListingSnackbar])

  const dispatch = useDispatch()

  async function checkIfApproved() {
    const isApproved = await contractERC.isApprovedForAll(defaultAccount, elasticContractAddress)
    setApproved(isApproved)
  }

  const approveOperator = async () => {
    if (!approved) {
      setProcessing(true)
      const tx = await contractERC.setApprovalForAll(elasticContractAddress, true)
      await tx.wait(1)
      setApproved(true)
    }
  }

  const listNFT = async (evt) => {

    evt.preventDefault()
    setProcessing(true)
    const weiCollateral = ethers.utils.parseEther(collateralDeposit.toString())
    
    // Storing price per second in WEI
    const weiPrice = ethers.utils.parseEther(rentPerDay.toString()).div(24 * 60 * 60)

    try{
      const tx =  await contract.listNFT(
        nFTAddress,
        tokenId,
        weiPrice,
        weiCollateral,
        benefits
      )
      setOpenListingSnackbar(true)
    }
    catch{
      alert('unable to create rental listing')
    }
  }

  const handleListingSnackbarClose = ()=>{
    setOpenListingSnackbar(false)
  }


  const action = (
    <>
      <Alert severity="success">
      <Button size="small" onClick={()=>navigate('/Dashboard')}>
        DASHBOARD
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleListingSnackbarClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
      </Alert>
    </>
  );

  return (


    defaultAccount ? (
      <Box>
        <Snackbar
            open={openListingSnackbar}
            autoHideDuration={6000}
            onClose={handleListingSnackbarClose}
            message="NFT Listed, check Dashboard to view -->"
            action={action}
        />
        <center>
          <Card variant="outlined" sx={{ display: 'inline-block', backgroundColor: "white", width: "40%", marginTop: 3, boxShadow: 3 }}>
            <CardHeader title="LIST AN NFT" />

            
              <Grid
                container
                columns={{ xs: 12, sm: 12, md: 12 }}
                item
                spacing={2}
                direction="column"
                justifyContent="center"
                alignItems="stretch"
                paddingRight={4}
                paddingLeft={4}
                paddingBottom={3}
                paddingTop={2}
              >
                <Grid item>
                  <TextField label="Details benefits"
                    variant="outlined"
                    onChange={(e) => setBenefits(e.target.value)}
                    fullWidth="true"
                  >
                  </TextField>
                </Grid>

                <Grid item >
                  <TextField label="Rent per day"
                    variant="outlined"
                    onChange={(e) => setRentPerDay(e.target.value)}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">ETH</InputAdornment>
                    }}
                    fullWidth="true"
                  >
                  </TextField>
                </Grid>

                <Grid item>
                  <TextField label="Collateral deposit"
                    variant="outlined"
                    onChange={(e) => setCollateralDeposit(e.target.value)}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">ETH</InputAdornment>
                    }}
                    fullWidth="true"
                  >
                  </TextField>
                </Grid>

                <Grid item>
                  <TextField label="NFT address"
                    variant="outlined"
                    onChange={(e) => setNFTAddress(e.target.value)}
                    fullWidth="true"
                  >
                  </TextField>
                </Grid>

                <Grid item>
                  <TextField label="Token id"
                    variant="outlined"
                    onChange={(e) => setTokenId(e.target.value)}
                    fullWidth="true"
                  >
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={12} md={12}>
                  <Box>
                    {contractERC ? (approved && !processing ? (
                      <Button variant="contained"
                        color="success"
                        onClick={listNFT}
                      >
                        LIST NFT
                      </Button>
                    ) :
                    (!approved && processing) || (approved && processing) ? (<CircularProgress/>) : 
                    (
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
              </Grid>
        
          </Card>
        </center>
      </Box>


    ) : <div>
      <center>
        <Typography sx={{ fontSize: 20 }}>
          Please connect your wallet to list an NFT.
        </Typography>
        <img width='25%' height='25%' src={ElasticLogo} />


      </center>

    </div>
  )
}

export default List