
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import List from "./components/List";
import Search from "./components/Search";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Dashboard from "./components/Dashboard";
import { createTheme, ThemeProvider } from "@mui/material"
import { ethers } from 'ethers'
import { useDispatch, useSelector } from 'react-redux'
import React, { useEffect } from 'react'
import ElasticContractBuilder from './contracts/Elastic.json'
import { logEventData } from "./utils.js"
// import ReceiptPDF from "./components/ReceiptPDF";

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

  const ABI = ElasticContractBuilder.abi
  const ADDRESS = ElasticContractBuilder.address

  const dispatch = useDispatch()
  const provider = useSelector(state => state.provider)
  const contract = useSelector(state => state.contract)
  const refresher = useSelector(state => state.refresher)

  const handleRefresher = () => {
    dispatch({ type: 'SET_UPDATE_REFRESHER', payload: refresher + 1 })
  }

  useEffect(() => {
    updateEthers()
  }, [])

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
  }, [provider, refresher])

  useEffect(() => {
    if (contract) {
      contract.on('NFTListed', handleRefresher);
      contract.on('NFTUnlisted', handleRefresher);
      contract.on('NFTRented', handleRefresher);
      contract.on('NFTReturned', handleRefresher);
      contract.on('NFTRemoved', handleRefresher);

      // cleanup this component
      return () => {
        contract.removeAllListeners();
      };
    }
  }, [contract, refresher]);

  const updateEthers = async () => {

    let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    dispatch({ type: "SET_PROVIDER", payload: tempProvider })

    let tempSigner = tempProvider.getSigner();
    dispatch({ type: "SET_SIGNER", payload: tempSigner })

    let tempContract = new ethers.Contract(ADDRESS, ABI, tempSigner)
    dispatch({ type: "SET_CONTRACT", payload: tempContract })
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="Search" element={<Search />} />
          <Route path="List" element={<List />} />
          <Route path="Dashboard" element={<Dashboard />} />
          {/* <Route path="Receipt" element={<ReceiptPDF />} /> */}
        </Routes>
        <Footer />
      </ThemeProvider>
    </>
  );
}

export default App;
