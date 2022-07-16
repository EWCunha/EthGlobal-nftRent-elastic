import React, { useEffect, useState } from 'react'
import { Box, Button, Typography, Card, Grid, TextField } from '@mui/material'
import MockNFT from '../img/TestImage.png'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { ethers } from 'ethers'
import ElasticContractBuilder from '../contracts/Elastic.json'
import { logEventData } from '../utils'


const Search = () => {

  const nftData = useSelector((state) => state.nftData)
  const state = useSelector(state => state)
  const provider = useSelector(state => state.provider)
  const dispatch = useDispatch()

  const [listedNFTs, setListedNFTs] = useState([])

  useEffect(() => {
    if (provider && ElasticContractBuilder.address) {
      logEventData("NFTListed", [], provider, setListedNFTs)
    }
  }, [])

  useEffect(() => {
    if (listedNFTs.length > 0) {
      console.log(listedNFTs)
    }
  }, [listedNFTs])

  //   useEffect(()=>{
  //   if(nftData){
  //  console.log("nft Data",nftData)
  //   }
  //   },[nftData])  

  // const SearchResults = () => {
  //   return(
  //       benefits.map((des) => {
  //         return (

  //           <Grid container columnSpacing = { { xs:4, sm:4, md:4 } }>        

  //             <Grid item xs={ 4 } sm={ 4 } md={ 4 }>
  //                   <img width='50%' height='50%' src={MockNFT}/>
  //             </Grid>

  //             <Grid item xs={ 4 } sm={ 4 } md={ 4 }>
  //               <Typography>{des}</Typography>
  //             </Grid>

  //             <Grid item xs={ 4 } sm={ 4 } md={ 4 }>
  //               <Link to='/Rent'>
  //                 <Button variant="contained"
  //                 color="success"
  //                 >
  //                   Rent
  //                 </Button>
  //               </Link>
  //             </Grid>

  //           </Grid>
  //         )
  //       }
  //     )
  //   )
  // }

  return (

    // <SearchResults/>
    <div></div>

  )
}

export default Search