//Import
import {urlFetch} from './../Parts/url_fetch'

// Constants
const dataInicial = {
    languages: [],
}

// types
const GET_LANGUAGES_SUCCESS = 'GET_LANGUAGES_SUCCESS'

// reducer
export default function filesReducer(state = dataInicial, action){
    switch(action.type){
        case GET_LANGUAGES_SUCCESS:
            return {...state, languages: action.payload}
        default:
            return state
    }
}

// actions
export const getLanguagesAction = () => async (dispatch, getState) => {
    try {	    
	    const response = await fetch(
	      urlFetch+"languages_list.php",{
	            method: "POST",
	          }
	    )

	    const res = await response.json()
	    	dispatch({
	            type: GET_LANGUAGES_SUCCESS,
	            payload: res.message.data
	        })
	        
	    return res.message
	    
    } catch (error) {
        return false
    }
}