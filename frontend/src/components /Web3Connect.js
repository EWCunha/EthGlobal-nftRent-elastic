import React, { useState, useEffect } from 'react';
import {Button} from "@mui/material"
import { ethers } from 'ethers'
import { useDispatch } from 'react-redux'
import contractJSON from "../contract_info/contractABI.json"

const Web3Connect = () => {

    const ABI = contractJSON.abi
    const ADDRESS = contractJSON.address

    const dispatch = useDispatch()

    const [connButtonText, setConnButtonText] = useState('Connect Wallet');
    const [accountchanging, setAccountChanging] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null);
    const [connectButtonColor, setConnectButtonColor] = useState("secondary")

    const [defaultAccount, setDefaultAccount] = useState(null)
    const [provider, setProvider] = useState(null)
    const [signer, setSigner] = useState(null)
    const [walletBalance, setWalletBalance] = useState(null)

    const connectWalletHandler = () => {
        if (window.ethereum && window.ethereum.isMetaMask) {
            console.log("CONNECTING TO WALLET")
            window.ethereum.request({ method: 'eth_requestAccounts' })
                .then(result => {

                    accountChangedHandler(result[0]);
                    setConnButtonText('Wallet Connected');
                    setConnectButtonColor("success")



                })
                .catch(error => {
                    setErrorMessage(error.message);

                });

        } else {
            console.log('Need to install MetaMask');
            setErrorMessage('Please install MetaMask browser extension to interact');
        }
}

const accountChangedHandler = (newAccount) => {
    if (!accountchanging) {
        setAccountChanging(true)
        setDefaultAccount(checkAccountType(newAccount));
        dispatch({type:"SET_ACCOUNT",payload: checkAccountType(newAccount)})
        updateEthers();
    }

}

const checkAccountType = (newAccount) => {
    if (Array.isArray(newAccount)) {
        return newAccount[0].toString()
    }
    else {
        console.log("current user: " + newAccount)
        return newAccount
    }
}

const updateEthers = async () => {
    let tempProvider = await new ethers.providers.Web3Provider(window.ethereum);
    setProvider(tempProvider);
    dispatch({type:"SET_PROVIDER",payload:tempProvider})

    let tempSigner = await tempProvider.getSigner();
    setSigner(tempSigner);
    dispatch({type:"SET_SIGNER",payload:tempSigner})
    
    let tempContract = await new ethers.Contract(ADDRESS, ABI, tempSigner)
    dispatch({ type:"SET_CONTRACT", payload:tempContract })

}

const chainChangedHandler = () => {
    // reload the page to avoid any errors with chain change mid use of application
    window.location.reload();
}

const getWalletBalance = async (provider) => {
    // Look up the balance
    if (provider !== null && defaultAccount !== null) {
        let balance = await provider.getBalance(defaultAccount);
        setWalletBalance(ethers.utils.formatEther(balance))
        dispatch({type:"SET_BALANCE",payload:ethers.utils.formatEther(balance)})
    }

}

useEffect(() => {
getWalletBalance(provider)
}, [provider,walletBalance])

useEffect(() => {
    if (accountchanging === false) {
        // listen for account changes
        window.ethereum.on('accountsChanged', accountChangedHandler);
        window.ethereum.on('chainChanged', chainChangedHandler);
    }
    else {
        window.ethereum.removeListener('accountsChanged', accountChangedHandler);
        window.ethereum.removeListener('chainChanged', chainChangedHandler);
    }
}, [accountchanging])

return (
    <>
        <Button 
            onClick={connectWalletHandler} 
            color={connectButtonColor} 
            variant="contained" 
            sx={{ margin: 2 }}>{connButtonText}
        </Button>
    </>
  )
}

export default Web3Connect