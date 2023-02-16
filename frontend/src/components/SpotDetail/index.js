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

    useEffect(() => {
        const restoreSpot = async () => {
            await dispatch(getDetailOfSpot(spotId))
            await dispatch(getReviews(spotId))
        }
        restoreSpot()
    }, [dispatch, spotId])

    console.log()

    let previewImgArray
    if (spot?.SpotImages?.length > 0) {
        previewImgArray = spot.SpotImages.filter((image) => {
            if (image.preview === true) {
                return image
            }
        })
    }

    let otherImagesArr = spot?.SpotImages?.filter((image) => {
        if (image.preview === false) {
            return image
        }
    })


    let previewImg

    if (previewImgArray) {
        previewImg = previewImgArray[previewImgArray - 1]
    } else {
        previewImg = {
            url: null
        }
    }


    const otherImage = (i) => {
        if (!otherImage && !otherImage) return null
        if (!otherImage[i] && !otherImagesArr[i]) {
            return (
                <img />
            )
        }
    }
    //``````````````````````````````````

    //``````````````````````````````````


    return spot && (
        <div className="spotsDetailPage">
            <h2>{spot.name}</h2>
            <div className="location-container">
                {spot.city}, {spot.state}, {spot.country}
            </div>
            <div className="previewImg">
                <div className="preview-image-left">
                    {previewImgArray && <img src={previewImgArray[0].url} />}
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
        </div>
    )
}

export default SpotDetail
