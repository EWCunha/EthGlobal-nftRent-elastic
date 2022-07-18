import React, { useState, useEffect } from 'react'
import { Grid } from '@mui/material'
import { DashboardOwnedCard } from './DashboardOwnedCard'
import { DashboardRentedCard } from './DashboardRentedCard'
import { useSelector } from 'react-redux'
import { logEventData, filterEventsData, roundDecimal } from '../utils'
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
    const [returnedNFTs, setRenturnedNFTs] = useState([])
    const [rentedOwnedNFTs, setRentedOwnedNFTs] = useState([])
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
                agreementAddress: RentedNftData.agreementAddress
            }

            delete returnObj.benefitsClearText
            resultInfo.push(returnObj)
        }

        let finalResult
        if (rentedOwnedNFTs.length > 0) {
            finalResult = handleOwnedNftRented(resultInfo, rentedOwnedNFTs)
        } else {
            finalResult = resultInfo
        }

        setterFunctionInfo(finalResult)
    }

    const handleNftTables = async (event1, event2, filter1, filter2, setterFunction) => {
        const result1 = await logEventData(event1, filter1, provider)
        const result2 = await logEventData(event2, filter2, provider)
        const finalResult = filterEventsData(result1, result2)
        setterFunction(finalResult)
    }

    function handleOwnedNftRented(infoOwned, rentedOwned) {
        if (infoOwned.length > 0 && rentedOwned.length > 0) {
            const newNftsInfoOwned = [...infoOwned]
            for (let ii = 0; ii < rentedOwned.length; ii++) {
                for (let jj = 0; jj < newNftsInfoOwned.length; jj++) {
                    if (rentedOwned[ii].itemId === newNftsInfoOwned[jj].itemId) {
                        newNftsInfoOwned[jj] = {
                            ...newNftsInfoOwned[jj],
                            startTime: rentedOwned[ii].startTime,
                            rentTime: rentedOwned[ii].rentTime,
                            agreementAddress: rentedOwned[ii].agreementAddress
                        }
                        break
                    }
                }
            }

            return newNftsInfoOwned
        }
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
            logEventData("NFTRented", [defaultAccount], provider, setRentedOwnedNFTs)
            handleNftTables("NFTListed", "NFTUnlisted", [defaultAccount], [defaultAccount], setListedNFTs)
            handleNftTables("NFTRented", "NFTReturned", [null, defaultAccount], [defaultAccount], setRentedNFTs)
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
        console.log(nftsInfoOwned)
        // console.log(nftsInfoOwned)
    }, [nftsInfoOwned])

    useEffect(() => {
        if (nftsInfoOwned.length > 0 && rentedOwnedNFTs.length > 0) {
            // console.log(nftsInfoOwned)
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