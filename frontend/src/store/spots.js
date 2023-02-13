import { csrfFetch } from "./csrf";
const LOAD_SPOTS = 'spots/LOAD_SPOTS';
const LOAD_CURRENT_USER_SPOT = 'spots/LOAD_CURRENT_USER_SPOT';
const LOAD_SPOT_DETAILS = 'spots/LOAD_SPOT_DETAILS'

const loadSpots = (spots) => {
    return {
        type: LOAD_SPOTS,
        spots
    }
}

const loadCurrentUserSpot = (currentUserSpot) => {
    return {
        type: LOAD_CURRENT_USER_SPOT,
        currentUserSpot,
    }
}

const loadSpotDetails = (spot) => {
    return {
        type: LOAD_SPOT_DETAILS,
        spot
    }
}




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
        dispatch(loadCurrentUserSpot(list))
    }
}

//get detail of a spot
export const getDetailOfSpot = (spotId) => async dispatch => {
    const response = await fetch(`/api/spots/${spotId}`);
    if (response.ok) {
        const list = await response.json();
        dispatch(loadSpotDetails(list));
    }
}

//create a spot
export const createASpot = (spot) => async () => {
    const newSpot = await csrfFetch(`/api/spots`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(spot)
    });
    const aNewSpot = await newSpot.json();
    return aNewSpot
}

//create a image
export const createImageForSpot = (spotId, image) => async () => {
    const newImg = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(image)
    })
    const aNewImg = await newImg.json();
    return aNewImg
}

//edit a spot
export const editASpot = (spot, spotId) => async () => {
    const updateSpot = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(spot)
    })
    const updatedSpot = await updateSpot.json()
    return updatedSpot
}

//delete a spot
export const deleteASpot = (spotId) => async () => {
    const deleteSpot = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE'
    })
    return deleteSpot
}

//spots reducer
const spotsReducer = (state = {}, action) => {
    switch (action.type) {
        case LOAD_SPOTS:
            return { ...action.spots.Spots }
        case LOAD_CURRENT_USER_SPOT:
            return { ...action.currentUserSpot.Spots }
        case LOAD_SPOT_DETAILS:
            return { ...action.spot }
        default:
            return state;
    }
}

export default spotsReducer
