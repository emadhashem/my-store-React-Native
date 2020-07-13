const { SET_USER } = require("../constants")
import {combineReducers} from 'redux'

let initState = { 
    user : ''
}
const user = (state = initState , action) => {
    switch (action.type) {
        case SET_USER: return action.user
        default : return state
    }
}
export default combineReducers({user})