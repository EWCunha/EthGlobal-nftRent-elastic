import React, { useState, useEffect } from 'react'
import { Grid } from '@mui/material'
import { DashboardOwnedCard } from './DashboardOwnedCard'
import { DashboardRentedCard } from './DashboardRentedCard'
import { useSelector } from 'react-redux'
import {
    logEventData, filterListedUnlistedEventsData, filterRentedReturnedEventsData,
    filterAvailableItems, filterRentedItems, roundDecimal
} from '../utils'
import { ethers } from 'ethers'
import agreementJSON from "../contracts/Agreement.json"
import IERC721JSON from "../contracts/IERC721.json"


const Dashboard = () => {

    const defaultAccount = useSelector((state) => state.defaultAccount)
    const provider = useSelector(state => state.provider)
    const signer = useSelector(state => state.signer)
    const contract = useSelector((state) => state.contract)

    const [ownedNFTsData, setOwnedNFTsData] = useState([])
    const [rentedNFTsData, setRentedNFTsData] = useState([])
    const [nftsInfoOwned, setNftsInfoOwned] = useState([])
    const [nftsInfoRented, setNftsInfoRented] = useState([])
    const [time, setTime] = useState(Date.now());

    const getNftsInfo = async (stateVariable, setterFunctionInfo) => {
        setterFunctionInfo([])

        const resultInfo = []
        for (let ii = 0; ii < stateVariable.length; ii++) {
            const nft = stateVariable[ii]
            const ListedNftData = await contract.items(nft.itemId)
            const RentedNftData = await contract.rentedItems(nft.itemId)

            const returnObj = {
                ...nft,
                owner: ListedNftData.owner,
                tokenId: ListedNftData.tokenId.toNumber(),
                nftAddress: ListedNftData.nftAddress,
                collateral: parseFloat(ethers.utils.formatEther(ListedNftData.collateral)),
                price: parseFloat(ethers.utils.formatEther(ListedNftData.price)),
                rented: ListedNftData.rented,
                benefits: ListedNftData.benefits,
                agreementAddress: RentedNftData.agreementAddress,
                startTime: parseFloat(RentedNftData.startTime),
                rentTime: parseFloat(RentedNftData.rentTime)
            }

            delete returnObj.benefitsClearText
            resultInfo.push(returnObj)
        }

        setterFunctionInfo(resultInfo)
    }

    const handleOwnedNftTable = async () => {
        const listedNFts = await logEventData("NFTListed", [defaultAccount], provider)
        const unlistedNFTs = await logEventData("NFTUnlisted", [defaultAccount], provider)
        const removedNFTs = await logEventData("NFTRemoved", [defaultAccount], provider)

        let stillListedNFTs = filterListedUnlistedEventsData(listedNFts, unlistedNFTs)
        stillListedNFTs = filterListedUnlistedEventsData(stillListedNFTs, removedNFTs)

        setOwnedNFTsData(stillListedNFTs)
    }

    const handleRentedNftTable = async () => {
        const rentedNFTs = await logEventData("NFTRented", [null, defaultAccount], provider)
        const returnedNFTs = await logEventData("NFTReturned", [null, defaultAccount], provider)
        const removedNFTs = await logEventData("NFTRemoved", [null, defaultAccount], provider)

        const removedAndReturnedNFTs = [...returnedNFTs, ...removedNFTs]
        const balanceNFTs = filterRentedReturnedEventsData(rentedNFTs, removedAndReturnedNFTs)
        const stillRentedNFTs = filterRentedItems(rentedNFTs, balanceNFTs)
        setRentedNFTsData(stillRentedNFTs)
    }

    const handleTimer = (startTime, rentTime, returnStr = true) => {
        const currentTimer = startTime + rentTime - time / 1000
        const hours = Math.floor(currentTimer / 3600);
        const minutes = Math.floor((currentTimer - (hours * 3600)) / 60);
        const seconds = roundDecimal(currentTimer - (hours * 3600) - (minutes * 60), 0);

        let hoursStr = String(hours)
        let minutesStr = String(minutes)
        let secondsStr = String(seconds)
        if (hours < 10) { hoursStr = `0${hours}`; }
        if (minutes < 10) { minutesStr = `0${minutes}`; }
        if (seconds < 10) { secondsStr = `0${seconds}`; }

        if (currentTimer > 0) {
            if (returnStr) {
                return `${hoursStr}:${minutesStr}:${secondsStr}`
            }
            return currentTimer
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
            handleOwnedNftTable()
            handleRentedNftTable()
        }

        const interval = setInterval(() => setTime(Date.now()), 1000);
        return () => {
            clearInterval(interval);
        };
    }, [])

    useEffect(() => {
        if (ownedNFTsData.length > 0) {
            getNftsInfo(ownedNFTsData, setNftsInfoOwned)
        }
    }, [ownedNFTsData])

    useEffect(() => {
        if (rentedNFTsData.length > 0) {
            getNftsInfo(rentedNFTsData, setNftsInfoRented)
        }
    }, [rentedNFTsData])

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