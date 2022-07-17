import React, { useState, useEffect } from 'react'
import { Grid } from '@mui/material'
import { DashboardOwnedCard } from './DashboardOwnedCard'
import { DashboardRentedCard } from './DashboardRentedCard'
import { useSelector } from 'react-redux'
import { logEventData, filterEventsData } from '../utils'
import { ethers } from 'ethers'


const Dashboard = () => {

    const defaultAccount = useSelector((state) => state.defaultAccount)
    const provider = useSelector(state => state.provider)
    const contract = useSelector((state) => state.contract)

    const [listedNFTs, setListedNFTs] = useState([])
    const [rentedNFTs, setRentedNFTs] = useState([])
    const [rentedOwnedNFTs, setRentedOwnedNFTs] = useState([])
    const [nftsInfoOwned, setNftsInfoOwned] = useState([])
    const [nftsInfoRented, setNftsInfoRented] = useState([])
    const [time, setTime] = useState(Date.now());

    const getNftsInfo = async (stateVariable, setterFunctionInfo) => {
        setterFunctionInfo([])

        const resultInfo = []
        for (let ii = 0; ii < stateVariable.length; ii++) {
            const nft = stateVariable[ii]
            const nftData = await contract.items(nft.itemId)

            const returnObj = {
                ...nft,
                owner: nftData[0],
                tokenId: nftData[1].toNumber(),
                nftAddress: nftData[2],
                collateral: parseFloat(ethers.utils.formatEther(nftData[3])),
                price: parseFloat(ethers.utils.formatEther(nftData[4])),
                rented: nftData[5],
                benefits: nftData[6],
                agreementAddress: nftData[7]
            }

            delete returnObj.benefitsClearText
            resultInfo.push(returnObj)
        }

        setterFunctionInfo(resultInfo)
    }

    const handleNftTables = async (event1, event2, filter1, filter2, setterFunction) => {
        const result1 = await logEventData(event1, filter1, provider)
        const result2 = await logEventData(event2, filter2, provider)
        const finalResult = filterEventsData(result1, result2)
        setterFunction(finalResult)
    }

    // const handleOwnedNftRented = async (nfts) => {
    //     const result1 = await logEventData(event1, filter1, provider)
    //     const itemIdsRented = result1.map(item => {
    //         return item.itemId
    //     })
    //     for (let ii = 0; ii < itemIdsRented.length; ii++) {

    //     }
    // }

    const handleTimer = (startTime, daysToRent, returnStr = true) => {
        const currentTimer = startTime + daysToRent * 24 * 60 * 60 - time / 1000
        if (currentTimer >= 0) {
            return returnStr ? new Date(currentTimer * 1000).toISOString().substring(11, 19) : new Date(currentTimer * 1000)
        } else {
            return returnStr ? "00:00:00" : 0
        }
    }

    const unlistNFT = async (evt, nft) => {
        evt.preventDefault()

        const tx = await contract.unlistNFT(nft.itemId)
    }

    useEffect(() => {
        if (defaultAccount) {
            handleNftTables("NFTListed", "NFTUnlisted", [defaultAccount], [defaultAccount], setListedNFTs)
            handleNftTables("NFTRented", "NFTReturned", [null, defaultAccount], [defaultAccount], setRentedNFTs)
            logEventData("NFTRented", [defaultAccount], provider, setRentedOwnedNFTs)
        }

        const interval = setInterval(() => setTime(Date.now()), 1000);
        return () => {
            clearInterval(interval);
        };
    }, [])

    useEffect(() => {
        if (listedNFTs.length > 0) {
            getNftsInfo(listedNFTs, setNftsInfoOwned)
        }
    }, [listedNFTs])

    useEffect(() => {
        if (rentedNFTs.length > 0) {
            getNftsInfo(rentedNFTs, nftsInfoRented, setNftsInfoRented)
        }
    }, [rentedNFTs])

    useEffect(() => {
        if (nftsInfoOwned.length > 0 && rentedOwnedNFTs.length > 0) {
            console.log(rentedOwnedNFTs)
        }
    }, [nftsInfoOwned, rentedOwnedNFTs]);

    return (
        <>
            <Grid container style={{ display: "flex", gap: "1rem" }}>
                <DashboardOwnedCard nftsInfoOwned={nftsInfoOwned} handleTimer={handleTimer} />
                <DashboardRentedCard nftsInfoRented={nftsInfoRented} handleTimer={handleTimer} time={time} />
            </Grid>
        </>
    )
}

export default Dashboard