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
    const [nftsInfo, setNftsInfo] = useState([])
    const [time, setTime] = useState(Date.now());

    const getNftsInfo = async () => {
        setNftsInfo([])
        listedNFTs.map(async nft => {
            const nftData = await contract.items(nft[1])
            const nftTreatedData = nftData.map(data => {
                if (ethers.BigNumber.isBigNumber(data)) {
                    return data.toNumber()
                } else {
                    return data
                }
            })

            const returnObj = {
                itemId: nft[1],
                owner: nftTreatedData[0],
                tokenId: nftTreatedData[1],
                nftAddress: nftTreatedData[2],
                collateral: nftTreatedData[3],
                pricePerDay: nftTreatedData[4],
                rented: nftTreatedData[5],
                benefits: nftTreatedData[6],
                agreementAddress: nftTreatedData[7],
                daysToRent: nft.daysToRent,
                startTime: nft.startTime,
            }

            setNftsInfo([returnObj, ...nftsInfo])
        })
    }

    const handleNftTables = async (event1, event2, setterFunction) => {
        const result1 = await logEventData(event1, [defaultAccount], provider)
        const result2 = await logEventData(event2, [defaultAccount], provider)
        const finalResult = filterEventsData(result1, result2)
        setterFunction(finalResult)
    }

    useEffect(() => {
        if (defaultAccount) {
            handleNftTables("NFTListed", "NFTUnlisted", setListedNFTs)
            handleNftTables("NFTRented", "NFTReturned", setRentedNFTs)
        }
    }, [])

    useEffect(() => {
        if (listedNFTs.length > 0 && rentedNFTs.length > 0) {
            getNftsInfo()
        }
        if (listedNFTs.length > 0) {
            getNftsInfo()
        }
    }, [listedNFTs, rentedNFTs])

    useEffect(() => {
        const interval = setInterval(() => setTime(Date.now()), 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <>
            <Grid container style={{ display: "flex", gap: "1rem" }}>
                <DashboardOwnedCard nftsInfo={nftsInfo} time={time} />
                <DashboardRentedCard nftsInfo={nftsInfo} time={time} />
            </Grid>
        </>
    )
}

export default Dashboard