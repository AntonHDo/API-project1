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

    const { closeModal } = useModal();



    useEffect(() => {
        dispatch(getCurrentUserSpot())
    }, [dispatch])

    // const spots = useSelector(state => state.currentSpots)
    const spotsArray = Object.values(spots)



    const handleCLick = (spot) => {

        // console.log("spot for handle click", spots.id)
        dispatch(deleteASpot(spot))
        closeModal()
        history.push('/')
    }

    return (
        <div className="spotsPage">

            <h2>Manage Your Spots</h2>
            <button><Link to={'/spots/new'}>Create a New Spot</Link></button>
            <div className="eachSpot">

                {spotsArray.map(spot => (
                    <div
                        className='spotCard' key={spot.id}>
                        <Link to={`/spots/${spot.id}`}>
                            <div className="room">
                                <div className="imgDiv">
                                    <img className="spotImg" src={spot.previewImage}></img>
                                </div>
                                <div className="roomDetails">
                                    <div className="roomData">
                                        <div className="spotLocationContainer">
                                            <div className="spot-city">
                                                {spot.city}, {spot.state}
                                                <span className="starReview">
                                                    <i className="fa-sharp fa-solid fa-star"></i>
                                                    <span>{spot.avgRating}</span>
                                                </span>
                                                <div><b>${spot.price}</b> <span>night</span></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                        <Link to={`/spots/${spot.id}/edit`}>
                            <button>Update</button>
                        </Link>
                        {/* <button>Delete</button> */}

                        <OpenModalButton
                            buttonText="Delete"
                            modalComponent={
                                <>
                                    <h2>Confirm Delete</h2>
                                    <p>Are you sure you want to remove this spot from the listings?</p>
                                    <button onClick={(e) => handleCLick(spot.id)}>
                                        Yes
                                    </button>
                                    <button onClick={closeModal}>No</button>
                                </>
                            }
                        />

                    </div>
                ))}
            </div>
        </div>
    )

}

export default CurrentUserSpot
