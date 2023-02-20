import React from "react";
import OpenModalButton from "../OpenModalButton";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { getCurrentUserSpot } from "../../store/spots";
import './CurrentUserSpot.css'
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { deleteASpot } from "../../store/spots";


const CurrentUserSpot = () => {
    const history = useHistory()
    const dispatch = useDispatch()
    const spots = useSelector(state => state.spots.allSpots)

    for (let key in spots) {
        let avgRate = (Number(spots[key].avgRating) || "New")
        spots[key] = {
            address: spots[key].address,
            city: spots[key].city,
            country: spots[key].country,
            createdAt: spots[key].createdAt,
            description: spots[key].description,
            id: spots[key].id,
            lat: spots[key].lat,
            lng: spots[key].lng,
            name: spots[key].name,
            ownerId: spots[key].ownerId,
            previewImage: spots[key].previewImage,
            price: spots[key].price,
            state: spots[key].state,
            updatedAt: spots[key].updatedAt,
            avgRating: avgRate
        }
    }

    const { closeModal } = useModal();


    useEffect(() => {
        const refresh = async () => {
            await dispatch(getCurrentUserSpot())
        }
        refresh()
    }, [dispatch])

    // const spots = useSelector(state => state.currentSpots)
    const spotsArray = Object.values(spots)



    const handleCLick = async (spot) => {


        // console.log("spot for handle click", spots.id)
        await dispatch(deleteASpot(spot))
        closeModal()
        history.push('/')
    }



    return CurrentUserSpot && (
        <div className="spotsPage">

            <h2>Manage Your Spots</h2>
            <button className="create-spot-at-current"><Link className="current-spot-link" to={'/spots/new'}>Create a New Spot</Link></button>
            <div className="eachSpot">

                {spotsArray.map(spot => (
                    <div
                        className='spotCard' key={spot?.id}>
                        <Link to={`/spots/${spot?.id}`}>
                            <div className="room">
                                <div className="imgDiv">
                                    <img className="spotImg" src={spot?.previewImage}></img>
                                </div>
                                <div className="roomDetails">
                                    <div className="roomData">
                                        <div className="spotLocationContainer manageSpotsContainer">
                                            <div className="spot-city">
                                                {spot?.city}, {spot?.state}
                                                <span className="starReviewInCurrentSpot">
                                                    <i className="fa-sharp fa-solid fa-star"></i>
                                                    {spot?.avgRating}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                        <div className="update-delete-container">
                            <b>${spot?.price} <span>night</span></b>
                            <div className="updateDelete">

                                <Link to={`/spots/${spot?.id}/edit`}>
                                    <button className="updateButton">Update</button>
                                </Link>

                                <OpenModalButton
                                    buttonText="Delete"
                                    modalComponent={
                                        <>
                                            <h2>Confirm Delete</h2>
                                            <p>Are you sure you want to remove this spot from the listings?</p>
                                            <div className="confirm-buttons">
                                                <button className="site-button" onClick={(e) => handleCLick(spot?.id)}>
                                                    Yes
                                                </button>
                                                <button className="site-button" onClick={closeModal}>No</button>
                                            </div>
                                        </>
                                    }
                                />
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

}

export default CurrentUserSpot
