
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Rent from "./components/Rent";
import List from "./components/List";
import Search from "./components/Search";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import { createTheme, ThemeProvider } from "@mui/material"
import contractJSON from "./contracts/Elastic.json"
import { ethers } from 'ethers'
import { useDispatch, useSelector } from 'react-redux'
import React, { useEffect, useState,useRef } from 'react'
import ElasticContractBuilder from './contracts/Elastic.json'
import { logEventData } from "./utils.js"

let theme = createTheme({
  palette: {
    primary: {
      main: '#f44336',
    },
    secondary: {
      main: '#ffef62',
    },
  }
});

function App() {

  const ABI = contractJSON.abi
  const ADDRESS = contractJSON.address

  const dispatch = useDispatch()
  const firstTimeListner = useRef()
  firstTimeListner.current = true

  const provider = useSelector(state => state.provider)
  const contract = useSelector(state =>state.contract)

  const [stateContract, setStateContract] = useState(null)

  useEffect(() => {
    updateEthers()
  }, [])

  //event listeners setup to handle app refresh on data change
  useEffect(()=>{

    if(contract && firstTimeListner.current){
      contract.on("NFTListed",(owner,itemId,tokenURI,benefits,benefitsClearText,collateral,price,event)=>{ 
        contract.removeListener("NFTListed",(owner,itemId,tokenURI,benefits,benefitsClearText,collateral,price,event))
        console.log("NFT LISTED")
        dispatch({ type: 'SET_REFRESH' })
        firstTimeListner.current = false
      })
      

      contract.on("NFTUnlisted",(owner,itemID,event)=>{
        contract.removeListener("NFTUnlisted",(owner,itemID,event))
        console.log("NFT UNLISTED")
        dispatch({ type: 'SET_REFRESH' })
        firstTimeListner.current = false
      })
      

      contract.on("NFTRented",(owner,tenant,itemId,agreementAddress,nftAddress,rentTime,startTime,event)=>{
        contract.removeListener("NFTRented",(owner,tenant,itemId,agreementAddress,nftAddress,rentTime,startTime,event))
        console.log("NFT Rented")
        dispatch({ type: 'SET_REFRESH' })
        firstTimeListner.current = false
      })
    

      contract.on("ListedNFTDataModified",(owner,itemId,collateral,price,event)=>{
        contract.removeListener("ListedNFTDataModified",(owner,itemId,collateral,price,event))
        console.log("NFT Listed Data Modified")
        dispatch({ type: 'SET_REFRESH' })
        firstTimeListner.current = false
      })
      

      contract.on("NFTReturned",(owner,tenant,itemId,timestamp, event)=>{
        contract.removeListener("NFTReturned",(owner,tenant,itemId,timestamp, event))
        console.log("NFT Returned")
        dispatch({ type: 'SET_REFRESH' })
        firstTimeListner.current = false
      })
      

      contract.on("NFTRemoved",(owner,borrower,itemId,event)=>{
        contract.removeListener("NFTRemoved",(owner,borrower,itemId,event))
        console.log("NFT Removed")
        dispatch({ type: 'SET_REFRESH' })
        firstTimeListner.current = false
      })

      firstTimeListner.current = false
    }
    

  },[contract])

  

  useEffect(() => {
    const loggingData = async () => {
      const decodedEventsNFTListed = await logEventData("NFTListed", [], provider)
      dispatch({ type: 'SET_NFT_LISTED', payload: decodedEventsNFTListed })
      const decodedEventsNFTUNlisted = await logEventData("NFTUnlisted", [], provider)
      dispatch({ type: 'SET_NFT_UNLISTED', payload: decodedEventsNFTUNlisted })
      const decodedEventsNFTRented = await logEventData("NFTRented", [], provider)
      dispatch({ type: 'SET_NFT_RENTED', payload: decodedEventsNFTRented })
      const decodedEventsNFTReturned = await logEventData("NFTReturned", [], provider)
      dispatch({ type: 'SET_NFT_RETURNED', payload: decodedEventsNFTReturned })
      const decodedEventsNFTRemoved = await logEventData("NFTRemoved", [], provider)
      dispatch({ type: 'SET_NFT_REMOVED', payload: decodedEventsNFTRemoved })
    }
    if (provider) {
      loggingData()
    }
  }, [provider])


  //useEffect for debugging
  // useEffect(() => {
  //   if(stateContract) {
  //     console.log(state)
  //   }
  // },[stateContract])

  const updateEthers = async () => {

    let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    dispatch({ type: "SET_PROVIDER", payload: tempProvider })

    let tempSigner = tempProvider.getSigner();
    dispatch({ type: "SET_SIGNER", payload: tempSigner })

    let tempContract = new ethers.Contract(ADDRESS, ABI, tempSigner)
    dispatch({ type: "SET_CONTRACT", payload: tempContract })

    setStateContract(tempContract)

  }


  return (
    <>
      <ThemeProvider theme={theme}>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="Rent" element={<Rent />} />
          <Route path="Search" element={<Search />} />
          <Route path="List" element={<List />} />
          <Route path="Dashboard" element={<Dashboard />} />
        </Routes>
      </ThemeProvider>
    </>

  );
}

export default App;
