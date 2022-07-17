import { ethers } from "ethers"
import ElasticContractBuilder from './contracts/Elastic.json'

const logEventData = async (eventName, filters = [], provider, setterFunction = undefined) => {
    const ABI = ElasticContractBuilder.abi.filter(frag => frag.name && frag.name === eventName)[0]

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
    const decodedEvents = decodedEventsInputs.map((inputs, indexes) => inputs.map((input, index) => {
        // console.log(input, decodedEventsArgs[indexes][index])
        return { [input]: decodedEventsArgs[indexes][index] }
    }))

    // // console.log(decodedEventsInputs)
    // // console.log(decodedEventsArgs)
    console.log(decodedEvents)

    const decodedEventsRight = decodedEventsArgs.map(elem => elem.map(el => {
        if (ethers.BigNumber.isBigNumber(el)) {
            return ethers.utils.formatEther(el)
        } else {
            return el
        }
    }))

    if (typeof setterFunction !== "undefined") {
        setterFunction(decodedEventsRight)
    }
    return decodedEventsRight
}

const copyToClipboard = async (evt, value) => {
    evt.preventDefault()
    if ('clipboard' in navigator) {
        return await navigator.clipboard.writeText(value);
    } else {
        return document.execCommand('copy', true, value);
    }
}

const filterEventsData = (eventData1, eventData2, fieldName = "itemId") => {
    const itemIdsArr = []
    for (let jj = 0; jj < eventData2.length; jj++) {
        itemIdsArr.push(eventData2[jj][fieldName])
    }

    const resultEventData = eventData1.filter(elem => !itemIdsArr.includes(elem[fieldName]))

    return resultEventData
}

export { logEventData, copyToClipboard, filterEventsData }