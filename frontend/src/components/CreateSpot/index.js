import React from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { createASpot } from "../../store/spots";
import { getSpots } from "../../store/spots";
import { createImageForSpot } from "../../store/spots";

const CreateSpot = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const spots = useSelector(state => state.spots)
    console.log(spots)

    useEffect(() => {
        dispatch(getSpots())
    }, [dispatch])
    return (
        <>
            <div>Create a new Spot</div>
            <div>Where's your place located?</div>
            <div>Guests will only get your exact address once they booked a reservation.</div>
            <div>Country</div>
            <input type="text" />
            <div>Street Address</div>
            <input type="text" />
            <div>City</div>
            <input type="text" />
            <div>State</div>
            <input type="text" />
            <div>Latitude</div>
            <input type="number" />
            <div>Longitude</div>
            <input type="number" />
            <div>_________________________________________</div>

            <div>_________________________________________</div>
            <div>Create a title for your spot</div>
            <div>Catch guests' attention with a spot title that highlights what makes your place special.</div>
            <div>_________________________________________</div>
            <div>Set a base price for your spot</div>
            <div>Competitive pricing can help your listing stand out and rank higher in search results</div>
            <div>_________________________________________</div>
            <div>Liven up your spot with photos</div>
            <div>Submit a link to at least one photo to publish your spot</div>
            <div>_________________________________________</div>
            <button>Create Spot</button>
        </>
    )
}

export default CreateSpot
