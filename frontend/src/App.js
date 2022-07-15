
import {Routes, Route} from "react-router-dom";
import Home from "./components/Home";
import Rent from "./components/Rent";
import List from "./components/List";
import Search from "./components/Search";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import { createTheme, ThemeProvider} from "@mui/material"
import contractJSON from "./contracts/Elastic.json"
import { ethers } from 'ethers'
import { useDispatch, useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react'
import ElasticContractBuilder from './contracts/Elastic.json'

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

  const provider = useSelector(state => state.provider)

  const [stateContract, setStateContract] = useState(null)

  useEffect(() => {
    updateEthers()
  },[])

  useEffect(()=>{
    if(provider){
      LogData()
    }
  },[provider])


  //useEffect for debugging
  // useEffect(() => {
  //   if(stateContract) {
  //     console.log(state)
  //   }
  // },[stateContract])

  async function LogData() {
    const eventABI = ["event NFTListed(address indexed owner,uint256 indexed itemId,string tokenURI,string indexed benefits,string benefits,uint256 collateral,uint256 price)"]
    const iface = new ethers.utils.Interface(eventABI)

    const filter = {
      address: ElasticContractBuilder.address,
      topics: [iface.getEventTopic("NFTListed")],
      fromBlock: 0
    }

    const logs = await provider.getLogs(filter)
    const decodedEvents = logs.map(log => {
      return iface.parseLog(log).args
    })
    dispatch({type:'SET_NFT_DATA',payload:decodedEvents})
  }

  const updateEthers = async () => {
    
    let tempProvider = await new ethers.providers.Web3Provider(window.ethereum);
    dispatch({type:"SET_PROVIDER",payload:tempProvider})

    let tempSigner = await tempProvider.getSigner();
    dispatch({type:"SET_SIGNER",payload:tempSigner})
    
    let tempContract = await new ethers.Contract(ADDRESS, ABI, tempSigner)
    dispatch({ type:"SET_CONTRACT", payload:tempContract })

    setStateContract(tempContract)

}


  return (
    <>
      <ThemeProvider theme={theme}>
        <Header/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="Rent" element={<Rent/>}/>
          <Route path="Search" element={<Search/>}/>
          <Route path="List" element={<List/>}/> 
          <Route path="Dashboard" element={<Dashboard/>}/>
        </Routes> 
      </ThemeProvider>
    </>

  );
}

export default App;
