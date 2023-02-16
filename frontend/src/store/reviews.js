import { csrfFetch } from "./csrf";

const LOAD_REVIEWS = 'reviews/LOAD_REVIEWS'
const LOAD_CURRENT_REVIEWS = 'reviews/LOAD_CURRENT_REVIEWS'


const loadReviews = (reviews) => {
    return {
        type: LOAD_REVIEWS,
        reviews
    }
}

// const loadCurrentReviews = (reviews) => {
//     return {
//         type: LOAD_CURRENT_REVIEWS,
//         reviews
//     }
// }

//get current user reviews
// export const getCurrentReviews = () => async dispatch => {
//     const response = await csrfFetch(`/api/reviews/current`);
//     if (response.ok) {
//         const list = await response.json()
//         dispatch(loadCurrentReviews(list))
//     }
// }

//get all reviews by spot id
export const getReviews = (spotId) => async dispatch => {
    const response = await fetch(`/api/spots/${spotId}/reviews`);
    if (response.ok) {
        const reviews = await response.json();
        dispatch(loadReviews(reviews))
    }
}

//post a review
export const postAReview = (spotId, review) => async () => {
    const newReview = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(review)
    })
    const aNewReview = await newReview.json();
    return aNewReview
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
export const removeReview = (reviewId) => async () => {
    const deleteReview = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
    })
    return deleteReview
}

const initialState = {
    spot: {},
    user: {}
}

const reviewsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_REVIEWS:
            const spotReviews = {};
            action.reviews.Reviews.forEach(review => {
                spotReviews[review.id] = review
            })
            return {
                spot: spotReviews,
                user: { ...state.user }
            }
        // case LOAD_CURRENT_REVIEWS:
        //     return { ...action.reviews.Reviews }
        default:
            return state;
    }
}

export default reviewsReducer
