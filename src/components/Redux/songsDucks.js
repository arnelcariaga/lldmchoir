//Import
import {urlFetch} from './../Parts/url_fetch'
import Cookies from 'js-cookie';
import axios from "axios";

// Constants
const dataInicial = {
	songsCategories: [],
	addSongResults: [],
	songUploadProgress: 0
}
const fdDeleteSong = new FormData();
const fdAddSong = new FormData();
const fdUpdateSong = new FormData();
const fdGetSongsByUser = new FormData();

// types
const GET_SONGS_CATEGORIES_SUCCESS = 'GET_SONGS_CATEGORIES_SUCCESS'
const ADD_SONGS_SUCCESS = 'ADD_SONGS_SUCCESS'
const UPLOAD_SONG_PROGRESS = 'UPLOAD_SONG_PROGRESS'

// reducer
export default function filesReducer(state = dataInicial, action){
	switch(action.type){
		case GET_SONGS_CATEGORIES_SUCCESS:
		return {...state, songsCategories: action.payload}
		case ADD_SONGS_SUCCESS:
		return {...state, addSongResults: action.payload}
		case UPLOAD_SONG_PROGRESS:
		return {...state, songUploadProgress: action.payload}
		default:
		return state
	}
}


// actions
export const getSongsByUserAction = (data) => async (dispatch, getState) => {
	try{
		let userId = Cookies.get('userData') === undefined ? "" : JSON.parse(Cookies.get('userData'))["user_id"];
		fdGetSongsByUser.append("user_id", userId);

		const response = await axios({
			method: "post",
			url: urlFetch+"songs_list_by_user.php",
			data: fdGetSongsByUser,
		})

		return response.data.message.data

	}catch(error){
		console.log(error)
	}
}


export const getSongsAction = () => async (dispatch, getState) => {
	try{
		const response = await axios.post(urlFetch+"songs_list.php")

		return response.data.message.data
	}catch(error){
		console.log(error)
	}
}


export const getSongsCategoriesAction = () => async (dispatch, getState) => {
	try{
		const response = await axios.post(urlFetch+"categories_list.php")

		dispatch({
			type: GET_SONGS_CATEGORIES_SUCCESS,
			payload: response.data.message.data
		})
	}catch(error){
		console.log(error)
	}
}


export const addSongAction = (data) => async (dispatch, getState) => {
	try{
		let userId = Cookies.get('userData') === undefined ? "" : JSON.parse(Cookies.get('userData'))["user_id"],
		songName = data.song_name,
		language = data.language,
		file = data.file,
		categories = JSON.stringify(data.categories);

		fdAddSong.append("userId", userId)
		fdAddSong.append("songName", songName)
		fdAddSong.append("language", language)
		fdAddSong.append("file", file[0])
		fdAddSong.append("categories", categories)

		const response = await axios({
			method: "post",
			headers: {
				"Content-Type": "multipart/form-data",
			},
			url: urlFetch+"add_song.php",
			data: fdAddSong,
			onUploadProgress: function(e){
				dispatch({
					type: UPLOAD_SONG_PROGRESS,
					payload: Math.round((100 * e.loaded) / e.total)
				})
			}
		})

		dispatch({
			type: ADD_SONGS_SUCCESS,
			payload: response.data.message
		})
	}catch(error){
		console.log(error)
	}
}


export const updateSongAction = (data) => async (dispatch, getState) => {
	try{

		fdUpdateSong.append("song_id", data.song_id);
		fdUpdateSong.append("user_id", data.user_id);
		fdUpdateSong.append("song_name", data.song_name);
		fdUpdateSong.append("song_path", data.song_path);
		fdUpdateSong.append("file_type", data.file_type);
		fdUpdateSong.append("file_size", data.file_size);
		fdUpdateSong.append("language_id", data.language_id);
		fdUpdateSong.append("categories", JSON.stringify(data.categories));
		fdUpdateSong.append("song_published_date", data.song_published_date);
		fdUpdateSong.append("last_edit_date", data.last_edit_date);

		const response = await axios({
			method: "post",
			url: urlFetch+"edit_song.php",
			data: fdUpdateSong,
		})

		return response.data.message

	}catch(error){
		console.log(error)
	}
}


export const deleteSongAction = (songId) => async (dispatch, getState) => {
	try{
		const userId = Cookies.get('userData') === undefined ? "" : JSON.parse(Cookies.get('userData'))["user_id"];

		fdDeleteSong.append("song_id", songId);
		fdDeleteSong.append("user_id", userId);

		const response = await axios({
			method: "post",
			url: urlFetch+"delete_song.php",
			data: fdDeleteSong,
		})

		return response.data.message

	}catch(error){
		console.log(error)
	}
}