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

        <div>hihi</div>
    )
}

export default CreateSpot
