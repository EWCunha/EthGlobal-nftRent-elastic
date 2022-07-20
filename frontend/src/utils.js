import { ethers } from "ethers"
import ElasticContractBuilder from './contracts/Elastic.json'
import AgreementContractBuilder from './contracts/Agreement.json'

const logEventData = async (eventName, filters = [], provider, setterFunction = undefined, abiStr = "elastic") => {
    let ABI
    if (abiStr === "elastic") {
        ABI = ElasticContractBuilder.abi.filter(frag => frag.name && frag.name === eventName)[0]
    } else if (abiStr === "agreement") {
        ABI = AgreementContractBuilder.abi.filter(frag => frag.name && frag.name === eventName)[0]
    } else {
        throw new Error(`Wrong contract: ${abiStr}`)
    }

    let ABIStr = `event ${ABI.name}(`
    for (let ii = 0; ii < ABI.inputs.length; ii++) {
        ABIStr += `${ABI.inputs[ii].type} ${ABI.inputs[ii].indexed ? "indexed" : ""} ${ABI.inputs[ii].name}`
        if (ii < ABI.inputs.length - 1) {
            ABIStr += ","
        }
    }
    ABIStr += ")"

    const iface = new ethers.utils.Interface([ABIStr])

    const topics = iface.encodeFilterTopics(ABI.name, filters)

    const filter = {
        address: ElasticContractBuilder.address,
        topics,
        fromBlock: 0
    }

    const logs = await provider.getLogs(filter)
    const decodedEventsArgs = logs.map(log => {
        return iface.parseLog(log).args
    })
    const decodedEventsInputs = logs.map(log => {
        return iface.parseLog(log).eventFragment.inputs
    })

    let decodedEvents = []
    for (let ii = 0; ii < decodedEventsInputs.length; ii++) {
        const result = decodedEventsInputs[ii].map((input, index) => {
            if (input.name === "itemId" || input.name === "rentTime" || input.name === "startTime") {
                return { [input.name]: decodedEventsArgs[ii][index].toNumber() }
            } else if (ethers.BigNumber.isBigNumber(decodedEventsArgs[ii][index])) {
                return { [input.name]: parseFloat(ethers.utils.formatEther(decodedEventsArgs[ii][index])) }
            } else {
                return { [input.name]: decodedEventsArgs[ii][index] }
            }
        })

        let realRestul = {}
        for (let jj = 0; jj < result.length; jj++) {
            realRestul = { ...realRestul, ...result[jj] }
        }
        decodedEvents.push(realRestul)
    }

    if (typeof setterFunction !== "undefined") {
        setterFunction(decodedEvents)
    }

    return decodedEvents
}

const copyToClipboard = async (evt, value) => {
    evt.preventDefault()
    if ('clipboard' in navigator) {
        return await navigator.clipboard.writeText(value);
    } else {
        return document.execCommand('copy', true, value);
    }
}

const filterListedUnlistedEventsData = (listedEventArr, unlistedEventArr, fieldName = "itemId") => {
    const itemIdsArr = []
    let resultEventData = []
    if (unlistedEventArr && unlistedEventArr.length > 0) {
        for (let jj = 0; jj < unlistedEventArr.length; jj++) {
            itemIdsArr.push(unlistedEventArr[jj][fieldName])
        }
    }

    if (listedEventArr && listedEventArr.length > 0) {
        resultEventData = listedEventArr.filter(elem => !itemIdsArr.includes(elem[fieldName]))
    }
    // } else if (listedEventArr && listedEventArr.length > 0) {
    //     resultEventData = listedEventArr
    // }

    return resultEventData
}

const filterRentedReturnedEventsData = (rentedEventArr, returnedEventArr, fieldName = "itemId") => {
    let stillRentedItemIdsObj = {}
    if (rentedEventArr && rentedEventArr.length > 0) {
        for (let jj = 0; jj < rentedEventArr.length; jj++) {
            if (rentedEventArr[jj][fieldName] in stillRentedItemIdsObj) {
                stillRentedItemIdsObj[rentedEventArr[jj][fieldName]]++
            } else {
                stillRentedItemIdsObj[rentedEventArr[jj][fieldName]] = 1
            }
        }
    }
    if (returnedEventArr && returnedEventArr.length > 0) {
        for (let jj = 0; jj < returnedEventArr.length; jj++) {
            if (returnedEventArr[jj][fieldName] in stillRentedItemIdsObj) {
                stillRentedItemIdsObj[returnedEventArr[jj][fieldName]]--
            } else {
                stillRentedItemIdsObj[returnedEventArr[jj][fieldName]] = 0
            }
        }
    }

    return stillRentedItemIdsObj
}

const filterAvailableItems = (stillListedNFTsArr, balanceNFTsItemIdsObj, fieldName = "itemId") => {
    const itemIdsArr = []
    let resultEventData = []
    for (const item in balanceNFTsItemIdsObj) {
        if (balanceNFTsItemIdsObj[item] > 0) {
            itemIdsArr.push(parseInt(item))
        }
    }

    if (stillListedNFTsArr && stillListedNFTsArr.length > 0) {
        resultEventData = stillListedNFTsArr.filter(elem => !itemIdsArr.includes(elem[fieldName]))
    }

    return resultEventData
}

const filterRentedItems = (stillRentedNFTsArr, balanceNFTsItemIdsObj, fieldName = "itemId") => {
    const resultStillRentedNFTsArrReversed = []
    const reversedStillRentedNFTsArr = stillRentedNFTsArr.slice().reverse()
    const copyOfBalanceNFTsItemIdsObj = { ...balanceNFTsItemIdsObj }
    for (let ii = 0; ii < reversedStillRentedNFTsArr.length; ii++) {
        let item = reversedStillRentedNFTsArr[ii]
        if (copyOfBalanceNFTsItemIdsObj[item[fieldName]] > 0) {
            copyOfBalanceNFTsItemIdsObj[item[fieldName]]--
            resultStillRentedNFTsArrReversed.push(reversedStillRentedNFTsArr[ii])
        }
    }

    return resultStillRentedNFTsArrReversed.reverse()
}

function roundDecimal(num, decimals) {
    return Number(Math.round(num + "e" + decimals) + "e-" + decimals);
}

const cleanAgreementData = (agreementDataObj) => {
    const cleanedAgreementData = {}
    for (const item in agreementDataObj) {
        if (isNaN(item)) {
            if (item === "itemId" || item === "startTime" || item === "rentTime" || item === "tokenId") {
                cleanedAgreementData[item] = parseFloat(agreementDataObj[item])
            } else if (ethers.BigNumber.isBigNumber(agreementDataObj[item])) {
                cleanedAgreementData[item] = parseFloat(ethers.utils.formatEther(agreementDataObj[item]))
                if (item === "price") {
                    cleanedAgreementData[item] = roundDecimal(cleanedAgreementData[item] * 24 * 60 * 60, 5)
                }
            } else {
                cleanedAgreementData[item] = agreementDataObj[item]
            }
        }
    }

    return cleanedAgreementData
}

export {
    logEventData, copyToClipboard, filterListedUnlistedEventsData, filterRentedReturnedEventsData,
    filterAvailableItems, filterRentedItems, roundDecimal, cleanAgreementData
}