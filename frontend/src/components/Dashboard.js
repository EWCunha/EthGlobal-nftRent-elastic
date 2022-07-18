import React, { useState, useEffect } from 'react'
import { Grid } from '@mui/material'
import { DashboardOwnedCard } from './DashboardOwnedCard'
import { DashboardRentedCard } from './DashboardRentedCard'
import { useSelector } from 'react-redux'
import { logEventData, filterEventsData } from '../utils'
import { ethers } from 'ethers'
import agreementJSON from "../contracts/Agreement.json"
import IERC721JSON from "../contracts/IERC721.json"


const Dashboard = () => {

    const defaultAccount = useSelector((state) => state.defaultAccount)
    const provider = useSelector(state => state.provider)
    const signer = useSelector(state => state.signer)
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

    const handleTimer = (startTime, rentTime, returnStr = true) => {
        const currentTimer = startTime + rentTime - time / 1000
        // console.log(startTime, rentTime)
        if (currentTimer >= 0) {
            if (returnStr) {
                return new Date(currentTimer * 1000).toISOString().substring(11, 19)
            }
            return new Date(currentTimer * 1000)
        } else {
            if (returnStr) {
                return "00:00:00"
            }
            return 0
        }
    }

    const unlistNFT = async (evt, itemId) => {
        evt.preventDefault()

        const tx = await contract.unlistNFT(itemId)
        await tx.wait(1)
    }

    const withdrawCollateral = async (evt, agreementAddress) => {
        evt.preventDefault()

        const agreementContract = new ethers.Contract(agreementAddress, agreementJSON.abi, signer)
        const tx = await agreementContract.withdrawCollateral()
        await tx.wait(1)
    }

    const returnNFT = async (evt, agreementAddress, nftAddress) => {
        evt.preventDefault()

        const IERC721Contract = new ethers.Contract(nftAddress, IERC721JSON.abi, signer)
        const txApprove = await IERC721Contract.setApprovalForAll(agreementAddress, true)
        await txApprove.wait(1)

        const agreementContract = new ethers.Contract(agreementAddress, agreementJSON.abi, signer)
        const txReturnNFT = await agreementContract.returnNFT()
        await txReturnNFT.wait(1)
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
            getNftsInfo(rentedNFTs, setNftsInfoRented)
        }
    }, [rentedNFTs])

    useEffect(() => {
        if (nftsInfoRented.length > 0) {
            console.log(nftsInfoRented)
        }
    }, [nftsInfoRented])

    useEffect(() => {
        if (nftsInfoOwned.length > 0 && rentedOwnedNFTs.length > 0) {
            // console.log(rentedOwnedNFTs)
        }
    }, [nftsInfoOwned, rentedOwnedNFTs]);

    return (
        <>
            <Grid container style={{ display: "flex", gap: "1rem" }}>
                <DashboardOwnedCard
                    nftsInfoOwned={nftsInfoOwned}
                    handleTimer={handleTimer}
                    unlistNFT={unlistNFT}
                    withdrawCollateral={withdrawCollateral}
                />
                <DashboardRentedCard
                    nftsInfoRented={nftsInfoRented}
                    handleTimer={handleTimer}
                    time={time}
                    returnNFT={returnNFT}
                />
            </Grid>
        </>
    )
}

export default Dashboard