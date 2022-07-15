import React, { useEffect, useState } from 'react'
import { Box, Button, Typography, Card, Grid, TextField } from '@mui/material'
import MockNFT from '../img/TestImage.png'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { ethers } from 'ethers'
import ElasticContractBuilder from '../contracts/Elastic.json'


const Search = () => {

  const nftData = useSelector((state) => state.nftData)
  const state = useSelector(state => state)
  const provider = useSelector(state => state.provider)
  const dispatch = useDispatch()

  useEffect(() => {
    if (provider && ElasticContractBuilder.address) {
      LogData()
    }
  }, [])

  //   useEffect(()=>{
  //   if(nftData){
  //  console.log("nft Data",nftData)
  //   }
  //   },[nftData])

  async function LogData() {
    const eventABI = ["event NFTListed(address indexed owner,uint256 indexed itemId,string indexed benefits,uint256 collateral,uint256 price)"]
    const iface = new ethers.utils.Interface(eventABI)

    const filter = {
      address: ElasticContractBuilder.address,
      // topics: [iface.getEventTopic("NFTListed")],
      fromBlock: 0
    }
    console.log(iface.getEventTopic("NFTListed") === ethers.utils.id("NFTListed(address,uint256,string,uint256,uint256)"))
    const logs = await provider.getLogs(filter)
    const decodedEvents = logs.map(log => {
      return iface.parseLog(log).args
    })
    console.log(decodedEvents)
  }

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