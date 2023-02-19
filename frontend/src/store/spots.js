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
    console.log("response from spot store:", response)
    if (response.ok) {
        const spot = await response.json()
        dispatch(loadSpots(spot))
    }
}

//get current user spot
export const getCurrentUserSpot = () => async dispatch => {
    const response = await csrfFetch(`/api/spots/current`);
    if (response.ok) {
        const spot = await response.json()
        dispatch(loadCurrentUserSpot(spot))
        return spot
    }
    return response
}


export const getDetailOfSpot = (spotId) => async dispatch => {
    const response = await fetch(`/api/spots/${spotId}`);
    if (response.ok) {
        const spot = await response.json();
        dispatch(loadSpotDetails(spot));
        return spot
        // } else{
        //     throw new Error("error")
    }
}

//create a spot
export const createASpot = (data, image) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    if (response.ok) {
        const newSpot = await response.json();

        newSpot['SpotImages'] = [];
        for (let i = 0; i < image.length; i++) {
            let response2 = await csrfFetch(`/api/spots/${newSpot.id}/images`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(image[i])
            })
            if (response2.ok) {
                let oneImage = await response2.json()
                newSpot.SpotImages.push(oneImage)
                // console.log("new spot from create a spot", newSpot.SpotImages)
            }
        }

        // console.log("new spot from create a spot", image)
        dispatch(addSpot(newSpot))
        return newSpot
    }
    return response
}


//create an image
// export const createImageForSpot = (spotId, image) => async () => {
//     const newImg = await csrfFetch(`/api/spots/${spotId}/images`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(image)
//     })
//     const aNewImg = await newImg.json();
//     return aNewImg
// }


//edit a spot
export const editASpot = (spot, image, spotId) => async (dispatch) => {
    spot.previewImage = image[0].url
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(spot)
    })
    if (response.ok) {
        const editedSpot = await response.json()
        console.log("spot from spots store", spot)
        dispatch(editSpot(spot))
        // console.log("edited spot from the store:", editedSpot)
        return editedSpot
    }
    return response
}

// export const editASpot = (spot, image, spotId) => async (dispatch) => {
//     const response = await csrfFetch(`/api/spots/${spotId}`, {
//         method: "PUT",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(spot)
//     })
//     if (response.ok) {
//         const editedSpot = await response.json()

//         editedSpot['SpotImages'] = [];
//         for (let i = 0; i < image.length; i++) {
//             let response2 = await csrfFetch(`/api/spots/${editedSpot.id}/images`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify(image[i])
//             })
//             if (response2.ok) {
//                 let oneImage = await response2.json()
//                 editedSpot.SpotImages.push(oneImage)

//             }
//         }
//         dispatch(addSpot(editedSpot))
//         return editedSpot
//     }
//     return response
// }

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
            // newState = { ...state, allSpots: { ...state.allSpots }, singleSpot: { ...state.singleSpot } }
            newState = { ...state, allSpots: { ...state.allSpots }, singleSpot: { ...state.spot, ...action.spot } }
            newState.allSpots[action.spot.id] = action.spot
            newState.allSpots[action.spot.id]['previewImage'] = action.spot.SpotImages[0].url

            delete newState.allSpots.SpotImages
            return newState
        case LOAD_CURRENT_USER_SPOT:
            newState = { allSpots: {} };
            action.currentUserSpot.Spots.forEach((spot) => (newState.allSpots[spot.id] = spot))
            return newState

        case EDIT_SPOT:
            newState = { ...state, allSpots: { ...state.allSpots }, singleSpot: { ...state.singleSpot } }
            newState.singleSpot = action.editedSpot;
            newState.allSpots[action.editedSpot.id] = action.editedSpot;
            return newState
        case LOAD_SPOT_DETAILS:
            // newState = { ...state, allSpots: { ...state.allSpots }, singleSpot: { ...state.singleSpot } }
            newState = { ...state }
            newState.singleSpot = action.spot
            return newState
        case REMOVE_SPOT:
            // newState = { ...state, allSpots: { ...state.allSpots }, singleSpot: { ...state.singleSpot } }
            newState = { ...state }
            delete newState.allSpots[action.spotId]
            return newState
        default:
            return state;
    }
}

export default spotsReducer
