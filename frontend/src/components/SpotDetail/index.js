import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getDetailOfSpot } from "../../store/spots";
import { useParams, useHistory, Link } from "react-router-dom";
import { getReviews, postAReview, removeReview } from "../../store/reviews"
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
    const reviews2 = useSelector((state) => Object.values(state.reviews))
    const reviews = useSelector((state) => state.reviews.user)


    const { closeModal } = useModal()


    useEffect(() => {

        const refresh = async () => {

            await dispatch(getDetailOfSpot(spotId))

            await dispatch(getReviews(spotId))
        }
        refresh()
    }, [dispatch, spotId, JSON.stringify(reviews2)])

    // let preImgArray

    // if (spot?.SpotImages?.length > 0) {
    //     preImgArray = spot?.SpotImages?.filter((image) => {
    //         if (image.preview === true) {
    //             return image
    //         }
    //     })
    // }

    // let previewImg

    // if (preImgArray) {
    //     previewImg = preImgArray[preImgArray.length - 1]
    // } else {
    //     previewImg = {
    //         url: null
    //     }
    // }
    // let nonPrevImgs = spot?.SpotImage?.filter((image) => {
    //     if (image.preview === false) {
    //         return image
    //     }
    // })

    // const nonPrevImg = (i) => {
    //     if (!nonPrevImgs[i]) {
    //         return (
    //             <img src="null" alt="No Image"></img>
    //         )
    //     } else {
    //         return (
    //             <img src={nonPrevImgs[i].url} alt="Other spot pictures" />
    //         )
    //     }
    // }

    let reviewChecker
    let reviewNum = spot?.numReviews
    // let unusedreviewNum = spot?.numReviews

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
        let { Reviews } = reviews
        Reviews?.sort((a, b) => {
            const createdAtDateA = new Date(a?.createdAt)
            const createdAtDateB = new Date(b?.createdAt)
            if (createdAtDateA < createdAtDateB) {
                return 1
            } else if (createdAtDateA > createdAtDateB) {
                return -1
            } else {
                return 0
            }

        })


        // let dayDivider
        // for (let review of Reviews) {
        //     const year = (review.updatedAt).split('-')[0]
        //     const month = (review.updatedAt).split('-')[1]
        //     const date = (review.updatedAt).split('-')[2].slice(0, 2)
        //     dayDivider = year + "-" + month + "-" + date
        // }
        // Reviews.sort((a, b) => b - a)

        if (reviews?.length === 0) {
            return (
                <div></div>
            )
        } else {
            let name = spot.name
            return Reviews?.map((review) => {
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
                                                    <h2 className="h2button-delete">Confirm Delete</h2>
                                                    <p>Are you sure you want to delete this review?</p>
                                                    <button className="yes-please-delete" type="submit" onClick={handleSubmitForDelete}>Yes (Delete Review)</button>
                                                    <button className="no-do-not-delete" type="submit" onClick={closeModal}>No (Keep Review)</button>
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
                        <br></br>
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

    const createReview = (async (spotId, data) => {
        const newReview = await postAReview(spotId, data)
        await dispatch(newReview)
        await dispatch(getDetailOfSpot)
    })


    const compareRev = reviews?.Reviews?.find(review => review?.userId === user?.id)

    const reviewBtb = () => {
        if (user && user.id !== spot.ownerId && user.id !== compareRev?.userId) {
            return (
                <div>
                    <OpenModalButton
                        buttonText={"Post Your Review!"}
                        modalComponent={
                            <CreateReviewModal id={spotId} createReview={createReview} />
                        }
                    ></OpenModalButton>

                </div>
            )
        }
    }

    const avgStarPercent = () => {
        if (spot?.avgRating !== null) {
            const ratingPercent = Number(spot?.avgStarRating).toFixed(1)
            if (ratingPercent !== "0.0") return (ratingPercent)
        }
        return ""
    }

    const checkNewReview = () => {
        if (reviewChecker === "New") {
            return (
                <div className="hide-dot"> {reviewChecker}</div>
            )
        } else {
            return (
                <div className="show-dot"> {reviewNum} {reviewChecker}</div>
            )
        }
    }





    const rev = reviews?.Reviews?.find((review) => review?.userId === user?.id)
    const handleSubmitForDelete = async (e) => {
        e.preventDefault()

        await dispatch(removeReview(rev?.id))
        await dispatch(getDetailOfSpot(spotId))
        closeModal()
    }

    const previewImg = () => {
        return spot.SpotImages && (<div className="preview-image-left">
            {<img src={(spot.SpotImages[0].url)} alt="Main Preview Image 1" />}


            <div className="preview-image-right">
                {spot.SpotImages.filter((_, index) => (index !== 0)).map((image, index) => (
                    <img src={image.url} alt={`spot image ${index + 2}`} />
                ))}
            </div>

        </div>)
    }

    return spot && (
        <div className="spotsDetailPage">
            <h2>{spot.name}</h2>
            <div className="location-container">
                {spot.city}, {spot.state}, {spot.country}
            </div>

            {/* {spot?.SpotImages?.map(image => (
                <div className="image-container-testing">
                    <div className="imageTesting">
                        <img className="inSideImage" src={image?.url} />
                    </div>
                </div>
            ))} */}
            <div className="previewImg">

                {previewImg()}

            </div>
            <div className="info-container">
                <div className="info-col">
                    <h2>Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}</h2>
                    <div>{spot.description}</div>
                </div>
                <div className="price-reserve-container price-col">
                    <div className="price-inner">
                        <div className="price">
                            $
                            {spot?.price}
                            <span>night</span>
                        </div>
                        <div className="star-container">
                            <i className="fa-sharp fa-solid fa-star" />
                            {avgStarPercent()} {checkNewReview()}
                        </div>
                    </div>
                    {/* {spot.avgStarRating} · */}
                    <br></br>
                    <button className="site-button" onClick={() => alert('Feature Coming Soon...')}>Reserve</button>
                </div>
            </div>
            <hr></hr>
            <div className="star-review-container">
                <i className="fa-sharp fa-solid fa-star" />
                {avgStarPercent()}
                {checkNewReview()}
            </div>

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
