import React from "react";
import './EditSpot.css'
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { editASpot } from "../../store/spots";
import { getSpots } from "../../store/spots";
import { createASpot } from "../../store/spots";

const EditSpot = () => {
    const history = useHistory()
    const dispatch = useDispatch()
    const spots = useSelector(state => state.spots)
    const { spotId } = useParams()
    useEffect(() => {
        dispatch(getSpots(spotId))
    }, [dispatch])

    return (
        <div>hihihi</div>
    )
}

export default EditSpot
