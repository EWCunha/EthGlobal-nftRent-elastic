const initialState = { 
    benefits: ["apple", "pear"]
 }

 function rootReducer( state = initialState, action) {
    switch(action.type) {
        case "ENTER_DESCRIPTION": 
            return {
                benefits: [...state.benefits, action.payload]
            }
        default:
            return state
    }
 }

 export default rootReducer