import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Routes, Route, LINK, Navigate } from 'react-router-dom'
import { ethers } from "ethers"
import ElasticContractBuilder from '../contracts/Elastic.json'
import { logEventData } from '../utils'


const Dashboard = () => {

    const defaultAccount = useSelector((state) => state.defaultAccount)
    const provider = useSelector(state => state.provider)
    const [ownedNFTs, setOwnedNFTs] = useState([])
    const [rentedNFTs, setRentedNFTs] = useState([])

    useEffect(() => {
        if (defaultAccount) {
            setOwnedNFTs(logEventData("NFTListed", [defaultAccount], provider))
            setOwnedNFTs(logEventData("NFTRented", [defaultAccount], provider))
        }
    }, [])

    return (

        <>
            {
                //!defaultAccount ? !localDefaultAccount ? <Navigate to="/"/> : <div>Welcome to your dashboard</div> : <div>Welcome to your dashboard2</div>
                (!defaultAccount ? <Navigate to="/" /> : <div>Welcome to your dashboard!</div>)
            }
        </>

    )
}

export default Dashboard