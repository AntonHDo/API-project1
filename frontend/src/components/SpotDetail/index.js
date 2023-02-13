import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getDetailOfSpot } from "../../store/spots";
import { useParams, useHistory } from "react-router-dom";
import './SpotDetail.css'

const SpotDetail = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const { spotId } = useParams();
    const spot = useSelector((state) => state.spots)
    console.log("here is the spot", spot.name)

    useEffect(() => {
        dispatch(getDetailOfSpot(spotId))
    }, [dispatch])

    return (
        <div className="spotsDetailPage">
            <h2>{spot.name}</h2>
        </div>
    )
}

export default SpotDetail
