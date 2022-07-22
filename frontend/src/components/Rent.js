import React from 'react'
import { Box, Button, Typography, Card, Grid, TextField } from '@mui/material'

const Rent = () => {

  const rentNFT = () => {
    alert('Placeholder message-Sign off on tranaction with MetaMask to have NFT sent')
  }

  return (
    <Grid container item spacing={2}>
      <Grid item
        xs={12}
        sm={12}
        md={12}
      >
        <Typography>
          Rental Agreement
        </Typography>
      </Grid>

      <Grid item
        xs={12}
        sm={12}
        md={12}
      >
        <Typography>
          Deposit needed to rent
        </Typography>
      </Grid>

      <Grid item
        xs={6}
        sm={6}
        md={6}
      >
        <Box sx={{ bgcolor: "red" }}>
          <Typography>
            Calendar element to be inserted
          </Typography>
        </Box>
      </Grid>

      <Grid item
        xs={6}
        sm={6}
        md={6}
      >
        <Typography>
          Output: Rental Cost + Collateral Deposit
        </Typography>

        <Box>
          <Typography>
            Return by: Date
          </Typography>
          <Typography>
            Send to: Address
          </Typography>
        </Box>

        <Button variant="contained"
          color="warning"
          onClick={rentNFT}
        >
          RENT NFT
        </Button>
      </Grid>
    </Grid>
  )
}

export default Rent