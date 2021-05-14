//Import
import {urlFetch} from './../Parts/url_fetch'
import history from './../Parts/history'
import Cookies from 'js-cookie';

// Constants
const fd = new FormData();
const inHalfADay = 0.5; //12 hours
const dataInicial = {
    signInData: [],
    signUpData: []
}

// types
const DO_SIGNIN_SUCCESS = 'DO_SIGNIN_SUCCESS'
const DO_SIGNUP_SUCCESS = 'DO_SIGNUP_SUCCESS'

// reducer
export default function joinReducer(state = dataInicial, action){
    switch(action.type){
        case DO_SIGNIN_SUCCESS:
            return {...state, signInData: action.payload}
        case DO_SIGNUP_SUCCESS:
            return {...state, signUpData: action.payload}
        default:
            return state
    }
}

// actions
export const signInAction = (data) => async (dispatch, getState) => {
    try {
        fd.append("email", data.email);
	    fd.append("password", data.password);
	    
	    const response = await fetch(
	      urlFetch+"/signin.php",{
	            method: "POST",
	            body: fd,
	          }
	    )

	    const res = await response.json()
	    
	    if (res.message.data !== undefined) {
	    	dispatch({
	            type: DO_SIGNIN_SUCCESS,
	            payload: res.message.data
	        })
	        var userData = JSON.stringify(res.message.data);
	          Cookies.set('userData', userData, { path: '/', expires: inHalfADay });
	          Cookies.set('isLogged', true, { path: '/', expires: inHalfADay });
	    	history.push('/dashboard')
	    }else{
	    	return res.message
	    }
	    
    } catch (error) {
    	return false
    }
}


export const signUpAction = (data) => async (dispatch, getState) => {
    try {
        fd.append("user_name", data.user_name);
	    fd.append("email", data.email);
	    fd.append("password", data.password);
	    fd.append("user_type", data.user_type === undefined ? 1 : data.user_type);
	    
	    const response = await fetch(
	      urlFetch+"/signup.php",{
	            method: "POST",
	            body: fd,
	          }
	    )

	    const res = await response.json()
	    	dispatch({
	            type: DO_SIGNUP_SUCCESS,
	            payload: res.message.data
	        })
	        
	    return res.message
	    
    } catch (error) {
        return false
    }
}