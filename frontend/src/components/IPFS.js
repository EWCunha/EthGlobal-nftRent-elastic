import { Web3Storage } from 'web3.storage'
import envVar from "../.secret.json"

const api_token = envVar.WEB3_STORAGE_API_TOKEN

const uploadToIPFS = async (file, agreementAddress) => {
    const storageClient = new Web3Storage({ token: api_token })

    const blob = new Blob([JSON.stringify(file)], { type: 'application/json' })

    const files = [new File([blob], `receipt_of_agreement_${agreementAddress}.json`)]

    const CID = await storageClient.put(files)

    return CID
}

const retrieveFromIPFS = async (CID) => {
    const storageClient = new Web3Storage({ token: api_token })
    const response = await storageClient.get(CID)

    if (!response.ok) {
        console.error(`Failed to get ${CID}`)
    } else {
        return response
    }
}

export { uploadToIPFS, retrieveFromIPFS }