import {createStore, combineReducers, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'

import joinReducer from './joinDucks'
import songsDucks from './songsDucks'
import languagesDucks from './languagesDucks'

const rootReducer = combineReducers({
    joinData: joinReducer,
    songsData: songsDucks,
    languagesData: languagesDucks,
})

export default function generateStore() {
    const store = createStore( rootReducer, applyMiddleware(thunk) )
    return store
}