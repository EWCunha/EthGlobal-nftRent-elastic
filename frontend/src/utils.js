import { ethers } from "ethers"
import ElasticContractBuilder from './contracts/Elastic.json'

const logEventData = async (eventName, filters = [], provider) => {
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
    const decodedEvents = logs.map(log => {
        return iface.parseLog(log).args
    })

    const decodedEventsRight = decodedEvents.map(elem => elem.map(el => {
        if (ethers.BigNumber.isBigNumber(el)) {
            return el.toNumber()
        } else {
            return el
        }
    }))

    return decodedEventsRight
}

export { logEventData }