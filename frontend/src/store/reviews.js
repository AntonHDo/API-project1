import { csrfFetch } from "./csrf";

const LOAD_REVIEWS = 'reviews/LOAD_REVIEWS'
const LOAD_CURRENT_REVIEWS = 'reviews/LOAD_CURRENT_REVIEWS'
const POST_REVIEWS = 'reviews/POST_REVIEWS'
const REMOVE_REVIEWS = 'reviews/REMOVE_REVIEWS'


const deleteReview = (id) => {
    return {
        type: REMOVE_REVIEWS,
        id
    }
}

const loadReviews = (reviews) => {
    return {
        type: LOAD_REVIEWS,
        reviews
    }
}

const loadCurrentReviews = (reviews) => {
    return {
        type: LOAD_CURRENT_REVIEWS,
        reviews
    }
}

const createReview = (review) => {
    return {
        type: POST_REVIEWS,
        review
    }
}

// get current user reviews
export const getCurrentReviews = () => async dispatch => {
    const response = await csrfFetch(`/api/reviews/current`);
    if (response.ok) {
        const review = await response.json()
        dispatch(loadCurrentReviews(review.Reviews))
    }
}

//get all reviews by spot id
export const getReviews = (id) => async dispatch => {
    const response = await fetch(`/api/spots/${id}/reviews`);
    if (response.ok) {
        const reviews = await response.json();
        dispatch(loadReviews(reviews))
    }
}

//post a review
export const postAReview = (spotId, reviews) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(reviews)
    })
    if (response.ok) {
        const newReview = await response.json();
        dispatch(createReview(newReview))
        return newReview
    }
    return response
}

//create a review image
export const createImageForReview = (reviewId, image) => async () => {
    const newImg = await csrfFetch(`/api/reviews/${reviewId}/images`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(image)
    })
    const aNewImg = await newImg.json();
    return aNewImg
}

//edit a review
export const editAReview = (review, reviewId) => async () => {
    const updateReview = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(review)
    })
    const updatedReview = await updateReview.json()
    return updatedReview
}

//remove review
export const removeReview = (reviewId) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
    })
    const review = await response.json()
    dispatch(deleteReview(reviewId))
    return review
}

const initialState = {
    spot: {},
    user: {}
}

const reviewsReducer = (state = initialState, action) => {
    switch (action.type) {
        case REMOVE_REVIEWS:
            const deleteState = { ...state }
            // delete deleteState[action.id];
            deleteState.user.Reviews = deleteState.user.Reviews.filter(review => {
                return review.id !== action.id
            })
            return deleteState
        case LOAD_REVIEWS:
            // const spotReviews = { ...state };
            // action.reviews.Reviews.forEach(review => {
            //     spotReviews[review.id] = review
            // })
            // return {
            //     spot: spotReviews,
            //     user: { ...state.user }
            // }
            const newState = { ...state }
            newState.user = action.reviews
            // console.log("spotsreview from the reducer", newState)
            return newState
        case LOAD_CURRENT_REVIEWS:
            const currentReviews = {}
            action.reviews.forEach(review => {
                currentReviews[review.id] = review
            })
            return {
                spot: { ...state.spot },
                user: currentReviews
            }
        case POST_REVIEWS:
            const newPost = { ...state }
            newPost[action.review.id] = action.review
            return newPost
        default:
            return state;
    }
}

export default reviewsReducer
