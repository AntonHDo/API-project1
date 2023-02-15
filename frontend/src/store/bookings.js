import { csrfFetch } from "./csrf";

const GET_BOOKINGS = '/bookings/GET_BOOKINGS'
const GET_CURRENT_USER_BOOKING = '/bookings/GET_CURRENT_USER_BOOKING'
const REMOVE_BOOKING = 'bookings/REMOVE_BOOKINGS'

const getAllBookings = (bookings) => {
    return {
        type: GET_BOOKINGS,
        bookings
    }
}

const currentUserBooking = (bookings) => {
    return {
        type: GET_CURRENT_USER_BOOKING,
        bookings
    }
}

const removeBooking = () => {
    return {
        type: REMOVE_BOOKING
    }
}

//get all bookings based on spot id
export const getBookingsBySpotId = (spotId, booking) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/bookings`);
    if (response.ok) {
        const bookings = await response.json();
        dispatch(getAllBookings(bookings))
    }
}

//get current user booking
export const getCurrentUserBookings = () => async dispatch => {
    const response = await csrfFetch(`/api/bookings/current`)
    if (response.ok) {
        const bookings = await response.json();
        dispatch(currentUserBooking(bookings))
    }
}

//post a booking
export const postBooking = (spotId, booking) => async dispatch => {
    const newBooking = await csrfFetch(`/api/spots/${spotId}/bookings`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(booking)
    })
    const aNewBooking = await newBooking.json();
    return aNewBooking
}

//edit booking
export const editABooking = (booking, bookingId) => async () => {
    const updateBooking = await csrfFetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(booking)
    })
    const updatedBooking = await updateBooking.json()
    return updatedBooking
}

// delete a booking
export const deleteABooking = (bookingId) => async dispatch => {
    const deleteBooking = await csrfFetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE'
    })
    return deleteBooking
}

const initialState = {}
const bookingsReducer = (state = initialState, action) => {
    const newState = { ...state }
    switch (action.type) {
        case GET_BOOKINGS:
            newState.spotBooking = action.bookings
        case GET_CURRENT_USER_BOOKING:
            newState.currentBooking = action.bookings
            return newState
        case REMOVE_BOOKING:
            newState.currentBooking = initialState
            newState.spotBooking = initialState
            return newState
        default:
            return state;
    }
}

export default bookingsReducer
