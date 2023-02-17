import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getDetailOfSpot } from "../../store/spots";
import { useParams, useHistory } from "react-router-dom";
import { getReviews, removeReview } from "../../store/reviews"
import './SpotDetail.css'
import OpenModalButton from "../OpenModalButton";
import { useModal } from "../../context/Modal";
import CreateReviewModal from "../CreateReviewModal";


const SpotDetail = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const { spotId } = useParams();
    const spot = useSelector((state) => state.spots.singleSpot)
    const user = useSelector((state) => state.session.user)

    const reviews = useSelector((state) => state.reviews.user)
    console.log("reviews from spotdetail:", reviews)
    const { closeModal } = useModal()

    useEffect(() => {
        const refresh = async () => {

            await dispatch(getDetailOfSpot(spotId))
            await dispatch(getReviews(spotId))
        }
        refresh()
    }, [dispatch, spotId])

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
    const showReviews = () => {
        // console.log(reviews)
        if (reviews?.length === 0) {
            return (
                <div>hihi</div>
            )
        } else {
            console.log("review from reviews", reviews.Reviews)
            let name = spot.name
            return reviews.Reviews?.map((review) => {
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
                                <div key={review.id}>
                                    <OpenModalButton
                                        buttonText={"Delete"}
                                        modalComponent={
                                            <>
                                                <form onSubmit={handleSubmitForDelete}>
                                                    <button type="submit" onClick={handleSubmitForDelete}>Yes (Delete Review)</button>
                                                    <button type="submit" onClick={closeModal}>No (Keep Review)</button>
                                                </form>
                                            </>
                                        }
                                    />

                                </div>
                            </>
                        )
                    }
                }
                return (
                    <>
                        <div>
                            {review.User.firstName}
                            {starRating}
                        </div>
                        <div>
                            {dateCreated}
                        </div>
                        <div>
                            {review.review}
                        </div>
                        <div>
                            {reviewDeleteBtn()}
                        </div>
                    </>
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
                        modalComponent={
                            <CreateReviewModal id={spotId} />
                        }
                    ></OpenModalButton>
                </div>
            )
        }
    }

    const avgStarPercent = () => {
        if (spot?.avgRating !== null) {
            return spot?.avgStarRating?.toFixed(1)
        }
        return spot?.avgStarRating
    }

    const checkNewReview = () => {
        if (reviewChecker === "New") {
            return (
                <div>{reviewChecker}</div>
            )
        } else {
            return (
                <div>· {reviewNum} {reviewChecker}</div>
            )
        }
    }

    // useEffect(() => {
    //     const refresh = async () => {

    //         await dispatch(getDetailOfSpot(spotId))
    //         await dispatch(getReviews(spotId))
    //     }
    //     refresh()
    // }, [dispatch, spotId])



    const rev = reviews?.Reviews?.find((review) => review?.userId === user?.id)
    console.log("here is the reviews", rev)
    const handleSubmitForDelete = async (e) => {
        e.preventDefault()

        await dispatch(removeReview(rev?.id))
        await dispatch(getDetailOfSpot(spotId))
        closeModal()
    }



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
                            <img src={image.url[0]} alt="Main Preview Image" />
                            <div className="preview-image-right">
                                <img src={image.url[1]} alt="Preview Image 2" />
                                <img src={image.url[2]} alt="Preview Image 3" />
                                <img src={image.url[3]} alt="Preview Image 4" />
                                <img src={image.url[4]} alt="Preview Image 5" />

                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <hr></hr>
            <div className="info-container">
                <h2>Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}</h2>
                <div>{spot.description}</div>
                <div className="price-reserve-container">
                    <br></br>
                    <div>
                        $
                        {spot?.price}
                        night

                    </div>
                    {/* {spot.avgStarRating} · */}
                    <div>
                        <div>

                            <i className="fa-sharp fa-solid fa-star" />
                            {avgStarPercent()}
                            {checkNewReview()}
                        </div>
                    </div>
                    <button className="site-button" onClick={() => alert('Feature Coming Soon!')}>Reserve</button>
                </div>
            </div>
            <hr></hr>
            <div className="star-review-container">
                <i className="fa-sharp fa-solid fa-star" />
            </div>
            {avgStarPercent()}
            {checkNewReview()}
            <div>
                {reviewBtb()}
                {noReviewsYet()}
            </div>
            <div>
                {showReviews()}
            </div>
        </div>
    )
}

export default SpotDetail
