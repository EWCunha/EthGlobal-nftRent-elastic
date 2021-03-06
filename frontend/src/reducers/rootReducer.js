const initialState = {
    nftListed: null,
    nftUnlisted: null,
    nftRented: null,
    nftReturned: null,
    nftRemoved: null,
    defaultAccount: null,
    defaultAccountBalance: null,
    provider: null,
    signer: null,
    contract: null,
    ercInterface: null,
    refresher: 0,
    word: "",
    receipt: null
}

function rootReducer(state = initialState, action) {
    switch (action.type) {
        case "SET_NFT_LISTED":
            return {
                ...state, nftListed: action.payload
            }
        case "SET_NFT_UNLISTED":
            return {
                ...state, nftUnlisted: action.payload
            }
        case "SET_NFT_RENTED":
            return {
                ...state, nftRented: action.payload
            }
        case "SET_NFT_RETURNED":
            return {
                ...state, nftReturned: action.payload
            }
        case "SET_NFT_REMOVED":
            return {
                ...state, nftRemoved: action.payload
            }
        case "SET_PROVIDER":
            return {
                ...state, provider: action.payload
            }
        case "SET_ACCOUNT":
            return {
                ...state, defaultAccount: action.payload
            }
        case "SET_BALANCE":
            return {
                ...state, defaultAccountBalance: action.payload
            }
        case "SET_SIGNER":
            return {
                ...state, signer: action.payload
            }
        case "SET_CONTRACT":
            return {
                ...state, contract: action.payload
            }
        case "SET_ERC_INTERFACE":
            return {
                ...state, ercInterface: action.payload
            }
        case "SET_UPDATE_REFRESHER":
            return {
                ...state, refresher: action.payload
            }
        case "SET_SEARCH_WORD":
            return {
                ...state, word: action.payload
            }
        case "SET_RECEIPT":
            return {
                ...state, receipt: action.payload
            }
        default:
            return state
    }
}

export default rootReducer