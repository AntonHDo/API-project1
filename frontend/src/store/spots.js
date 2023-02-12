import { csrfFetch } from "./csrf";
const LOAD_SPOTS = 'spots/LOAD_SPOTS';

const loadSpots = (spots) => {
    return {
        type: LOAD_SPOTS,
        spots
    }
}
export const getSpots = () => async dispatch => {
    const response = await fetch(`/api/spots`);


    if (response.ok) {
        const list = await response.json()
        dispatch(loadSpots(list))
    }
}

const spotsReducer = (state = {}, action) => {
    const newState = { ...state }
    switch (action.type) {
        case LOAD_SPOTS:
            return { ...action.spots.Spots }
        default:
            return state;
    }
}

export default spotsReducer
