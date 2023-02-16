import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getSpots, getDetailOfSpot } from "../../store/spots";
import { useParams, useHistory } from "react-router-dom";
import { getReviews } from "../../store/reviews"
import './SpotDetail.css'
import OpenModalButton from "../OpenModalButton";


const SpotDetail = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const { spotId } = useParams();
    const spot = useSelector((state) => state.spots.singleSpot)
    const user = useSelector((state) => state.session.user)
    const getAllReviews = (state) => Object.values(state.reviews.spot)
    const reviews = useSelector(getAllReviews)


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
    // console.log("review from reviews", reviews)
    const showReviews = () => {
        if (reviews?.length === 0) {
            return (
                <div>hihi</div>
            )
        } else {
            let name = spot.name
            return reviews?.map((review) => {
                let starRating

                if (review?.stars === 1) {
                    starRating =
                        <span>
                            <i className="fa-sharp fa-solid fa-star" />

                        </span>
                }
                if (review?.stars === 2) {
                    starRating =
                        <div>
                            <i className="fa-sharp fa-solid fa-star" />
                            <i className="fa-sharp fa-solid fa-star" />
                        </div>
                }
                if (review?.stars === 3) {
                    starRating =
                        <div>
                            <i className="fa-sharp fa-solid fa-star" />
                            <i className="fa-sharp fa-solid fa-star" />
                            <i className="fa-sharp fa-solid fa-star" />
                        </div>
                }
                if (review?.stars === 4) {
                    starRating =
                        <div>
                            <i className="fa-sharp fa-solid fa-star" />
                            <i className="fa-sharp fa-solid fa-star" />
                            <i className="fa-sharp fa-solid fa-star" />
                            <i className="fa-sharp fa-solid fa-star" />
                        </div>
                }
                if (review?.stars === 5) {
                    starRating =
                        <div>
                            <i className="fa-sharp fa-solid fa-star" />
                            <i className="fa-sharp fa-solid fa-star" />
                            <i className="fa-sharp fa-solid fa-star" />
                            <i className="fa-sharp fa-solid fa-star" />
                            <i className="fa-sharp fa-solid fa-star" />
                        </div>
                }
                let date = new Date(review.createdAt);

                let year = date.toLocaleString("default", { year: "numeric" });
                let month = date.toLocaleString("default", { month: "2-digit" });
                let day = date.toLocaleString("default", { day: "2-digit" });

                let dateCreated = `${year}-${month}-${day}`;

                const reviewDeleteBtn = () => {
                    if (user && user.id === review.userId) {
                        return (
                            <>
                                <div>
                                    <OpenModalButton
                                        buttonText={"Delete"}
                                        modalComponent={"delete update"}
                                    />

                                </div>
                            </>
                        )
                    }
                }
                return review && (
                    <div>
                        {review?.User?.firstName}
                    </div>
                )
            })
        }
    }



    const reviewBtb = () => {
        if (user) {
            return (
                <div>
                    <OpenModalButton
                        buttonText={"Post Your Review!"}
                        modalComponent={"Will finish later"}
                    />
                </div>
            )
        }
    }
    const avgStarPercent = () => {
        if (spot.avgRating !== null) {
            return spot?.avgStarRating?.toFixed(1)
        }
        return spot?.avgStarRating
    }



    useEffect(() => {
        dispatch(getDetailOfSpot(spotId))
        dispatch(getReviews(spotId))
    }, [dispatch])




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
                <i className="fa-sharp fa-solid fa-star" />
                {reviewBtb()}
            </div>
            {noReviewsYet()}
            {avgStarPercent()}
            <div>
                {showReviews()}
            </div>
        </div>
    )
}

export default SpotDetail
