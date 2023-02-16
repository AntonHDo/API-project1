import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getSpots, getDetailOfSpot } from "../../store/spots";
import { useParams, useHistory } from "react-router-dom";
import { getReviews } from "../../store/reviews"
import './SpotDetail.css'


const SpotDetail = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const { spotId } = useParams();
    const spot = useSelector((state) => state.spots.singleSpot)
    const user = useSelector((state) => state.session.user)
    const getAllReviews = (state) => Object.values(state.reviews.spot)
    const reviews = useSelector(getAllReviews)
    //     const testingReviews = () =  > {
    //         if (user && user.id === '')
    // }



    let reviewChecker
    let reviewNum = spot?.numReviews
    let unusedreviewNum = spot?.numReviews

    if (reviewNum === 1) {
        reviewChecker = "review"
    } else if (reviewNum === 0) {
        reviewChecker = "New"
        reviewNum = ""
    } else {
        reviewChecker = ' reviews'
    }

    const noReviewsYet = () => {
        if (reviewChecker === "New" && user) {
            return (
                <div>
                    Be the first to post a review!
                </div>
            )
        }
    }

    useEffect(() => {
        const restoreSpot = () => {
            dispatch(getDetailOfSpot(spotId))
            dispatch(getReviews(spotId))
        }
        restoreSpot()
    }, [dispatch, spotId])




    return spot && (
        <div className="spotsDetailPage">
            <h2>{spot.name}</h2>
            <div className="location-container">
                {spot.city}, {spot.state}, {spot.country}
            </div>

            <div className="previewImg">
                <div className="preview-image-left">
                    {spot.SpotImages?.map(image => (
                        <div key={image.id}>
                            <img src={image.url} />
                        </div>
                    ))}
                </div>
                <div className="preview-image-right">
                    {/* <img src="https://mycleaningangel.com/wp-content/uploads/2020/11/airbnb-cleaning.jpg" />
                    <img src="https://mycleaningangel.com/wp-content/uploads/2020/11/airbnb-cleaning.jpg" />
                    <img src="https://mycleaningangel.com/wp-content/uploads/2020/11/airbnb-cleaning.jpg" />
                    <img src="https://mycleaningangel.com/wp-content/uploads/2020/11/airbnb-cleaning.jpg" /> */}
                </div>
            </div>
            <hr></hr>
            <div className="info-container">
                <div>Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}</div>
                <div className="price-reserve-container">
                    <div>
                        $
                        {spot?.price}
                        night,
                        {spot?.avgStarRating},
                        {spot?.numReviews}
                    </div>
                    <button>Reserve</button>
                </div>
            </div>
            <hr></hr>
            <div className="star-review-container">
                star review
            </div>
            {noReviewsYet()}
        </div>
    )
}

export default SpotDetail
