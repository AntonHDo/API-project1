import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getSpots, getDetailOfSpot } from "../../store/spots";
import { useParams, useHistory } from "react-router-dom";
import './SpotDetail.css'


const SpotDetail = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const { spotId } = useParams();
    const spots = useSelector((state) => state.spots)
    const spotsArray = Object.values(spots)

    useEffect(() => {
        dispatch(getDetailOfSpot(spotId))
    }, [dispatch])

    // useEffect(() => {
    //     dispatch(getSpots(spotId))
    // }, [dispatch])
    const currentSpot = spots[spotId]
    return currentSpot && (
        <div className="spotsDetailPage">
            {/* {currentSpot.ownerId === sessionStorage.user.id && ()} */}
            <h2>{currentSpot.name}</h2>
            <div className="location-container">
                City, State, Country
            </div>
            <div className="previewImg">
                {/* {spots[spotId].SpotImages[0].url} */}
            </div>
            <hr></hr>
            <div className="info-container">
                <div>Hosted by Firstname Lastname</div>
                <div className="price-reserve-container">
                    <div>price    star review</div>
                    <button>Reserve</button>
                </div>
            </div>
            <hr></hr>
            <div className="star-review-container">
                star review
            </div>
        </div>
    )
}

export default SpotDetail
