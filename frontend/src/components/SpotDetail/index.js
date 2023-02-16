import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getSpots, getDetailOfSpot } from "../../store/spots";
import { useParams, useHistory } from "react-router-dom";
import './SpotDetail.css'


const SpotDetail = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const { spotId } = useParams();
    const spot = useSelector((state) => state.spots.singleSpot)

    console.log("spotid from spot detail:", spotId)

    useEffect(() => {
        dispatch(getDetailOfSpot(spotId))
    }, [dispatch])

    // useEffect(() => {
    //     dispatch(getSpots(spotId))
    // }, [dispatch])

    return spot && (
        <div className="spotsDetailPage">
            <h2>{spot.name}</h2>
            <div className="location-container">
                {spot.city}, {spot.state}, {spot.country}
            </div>
            <div className="previewImg">
                {/* {spotImages.map(image => (
                    <img key={image.id} src={image.url} />
                ))} */}
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
