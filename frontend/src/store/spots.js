import { csrfFetch } from "./csrf";
const LOAD_SPOTS = 'spots/LOAD_SPOTS';
const LOAD_CURRENT_USER_SPOT = 'spots/LOAD_CURRENT_USER_SPOT';
const LOAD_SPOT_DETAILS = 'spots/LOAD_SPOT_DETAILS'
const ADD_SPOT = 'spots/ADD_SPOT'
const REMOVE_SPOT = 'spots/REMOVE_SPOT'
const EDIT_SPOT = 'spots/EDIT_SPOT'

const loadSpots = (spots) => {
    return {
        type: LOAD_SPOTS,
        spots
    }
}

const loadCurrentUserSpot = (currentUserSpot) => {
    return {
        type: LOAD_CURRENT_USER_SPOT,
        currentUserSpot
    }
}

const loadSpotDetails = (spot) => {
    return {
        type: LOAD_SPOT_DETAILS,
        spot
    }
}

const addSpot = (spot) => {
    return {
        type: ADD_SPOT,
        spot
    }
}

const editSpot = (editedSpot) => {
    return {
        type: EDIT_SPOT,
        editedSpot
    }
}

const removeSpot = (spotId) => {
    return {
        type: REMOVE_SPOT,
        spotId
    }
}

// export const currentSpots = state => state.spots.allSpots

//get all spots
export const getSpots = () => async dispatch => {
    const response = await fetch(`/api/spots`);
    if (response.ok) {
        const list = await response.json()
        dispatch(loadSpots(list))
    }
}

//get current user spot
export const getCurrentUserSpot = () => async dispatch => {
    const response = await csrfFetch(`/api/spots/current`);
    if (response.ok) {
        const list = await response.json()
        console.log("list from get current user spot:", list)
        dispatch(loadCurrentUserSpot(list))
    }
}

//get detail of a spot
// export const getDetailOfSpot = (spotId) => async dispatch => {
//     const response = await fetch(`/api/spots/${spotId}`);
//     if (response.ok) {
//         const list = await response.json();
//         dispatch(loadSpots(list));
//     }
// }
export const getDetailOfSpot = (spotId) => async dispatch => {
    const response = await fetch(`/api/spots/${spotId}`);
    if (response.ok) {
        const list = await response.json();

        dispatch(loadSpotDetails(list));
    }
}

//create a spot
export const createASpot = (data) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    if (response.ok) {
        const newSpot = await response.json();
        dispatch(addSpot(newSpot))
        return newSpot
    }
    return response
}


//create a image
export const createImageForSpot = (spotId, image) => async () => {
    const newImg = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(image)
    })
    const aNewImg = await newImg.json();
    return aNewImg
}


//edit a spot
export const editASpot = (spot, spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(spot)
    })
    if (response.ok) {
        const editedSpot = await response.json()
        dispatch(editSpot(editedSpot))
    }
}


//delete a spot
export const deleteASpot = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: "DELETE"
    })
    if (response.ok) {
        dispatch(removeSpot(spotId))
    }
}


//spots reducer
const initialState = {
    allSpots: {},
    singleSpot: {}
}

const spotsReducer = (state = initialState, action) => {
    let newState = {}
    switch (action.type) {
        case LOAD_SPOTS:
            newState = { ...state, allSpots: { ...state.allSpots }, singleSpot: { ...state.singleSpot } }
            action.spots.Spots.forEach((spot) => (newState.allSpots[spot.id] = spot))
            return newState
        case ADD_SPOT:
            newState = { ...state, allSpots: { ...state.allSpots }, singleSpot: { ...state.singleSpot } }
            newState.singleSpot = action.spot
            return newState
        case LOAD_CURRENT_USER_SPOT:
            // newState = { ...state, allSpots: { ...state.allSpots }, singleSpot: { ...state.singleSpot } }
            newState = { allSpots: {} }
            action.currentUserSpot.Spots.forEach((spot) => (newState.allSpots[spot.id] = spot))
            return newState
        case EDIT_SPOT:
            newState = { ...state, allSpots: { ...state.allSpots }, singleSpot: { ...state.singleSpot } }
            newState.singleSpot = action.editedSpot;
            return newState
        case LOAD_SPOT_DETAILS:
            newState = { ...state, allSpots: { ...state.allSpots }, singleSpot: { ...state.singleSpot } }
            newState.singleSpot = action.spot
            return newState
        case REMOVE_SPOT:
            newState = { ...state, allSpots: { ...state.allSpots }, singleSpot: { ...state.singleSpot } }
            delete newState.singleSpot
            return newState
        default:
            return state;
    }
}

export default spotsReducer
