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

    let decodedEvents = []
    for (let ii = 0; ii < decodedEventsInputs.length; ii++) {
        const result = decodedEventsInputs[ii].map((input, index) => {
            if (input.name === "itemId" || input.name === "daysToRent" || input.name === "startTime") {
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

const filterEventsData = (eventData1, eventData2, fieldName = "itemId") => {
    const itemIdsArr = []
    for (let jj = 0; jj < eventData2.length; jj++) {
        itemIdsArr.push(eventData2[jj][fieldName])
    }

    const resultEventData = eventData1.filter(elem => !itemIdsArr.includes(elem[fieldName]))

    return resultEventData
}

export { logEventData, copyToClipboard, filterEventsData }