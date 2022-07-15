import React, { useEffect, useState } from 'react'
import { Box, Button, Typography, Card, Grid, TextField } from '@mui/material'
import MockNFT from '../img/TestImage.png'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { ethers } from 'ethers'
import ElasticAddress from '../contracts/Elastic.json'


const Search = () => {

  const nftData = useSelector((state) => state.nftData)
  const state = useSelector(state=>state)
  const provider = useSelector(state=>state.provider)
  const dispatch = useDispatch()

  useEffect(() => {
    if(provider && ElasticAddress.address){
      LogData()
    }
  },[])

//   useEffect(()=>{
//   if(nftData){
//  console.log("nft Data",nftData)
//   }
//   },[nftData])

  function LogData(){
    let filterABI = ["event NFTListed(address indexed owner,uint256 indexed itemId,string indexed benefits,uint256 collateral,uint256 price)"]
    let iface = new ethers.utils.Interface(filterABI)
    
    let address = ElasticAddress.address
    let stringAddress = address.toString()
    // console.log("string address",stringAddress)
    let filter = {
      address: stringAddress,
      fromBlock:0
    }

    let logPromise = provider.getLogs(filter)
    logPromise.then(function(logs){
        let events = logs.map((log)=>{
            return iface.parseLog(log).args
        })
        console.log("events",events)
        
    }).catch(function(err){
        console.log(err);
    });
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