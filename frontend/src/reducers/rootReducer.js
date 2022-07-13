const initialState = { 
    benefits: ["apple", "pear"], 
    defaultAccount: null,
    defaultAccountBalance: null,
    provider: null,
    signer: null,
    contract:null
 }

 function rootReducer( state = initialState, action) {
    switch(action.type) {
        case "ENTER_DESCRIPTION": 
            return {
                ...state, benefits: [...state.benefits, action.payload]
            }
        case "SET_PROVIDER":
            return{
                ...state, provider: action.payload
            }
        case "SET_ACCOUNT":
            return{
                ...state, defaultAccount: action.payload
            }
        case "SET_BALANCE":
            return{
                ...state, defaultAccountBalance: action.payload
            }
        case "SET_SIGNER":
            return{
                ...state, signer:action.payload
            }
        case "SET_CONTRACT":
            return{
                ...state, contract:action.payload
            }
        default:
            return state
    }
 }

 export default rootReducer