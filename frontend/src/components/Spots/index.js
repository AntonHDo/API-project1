import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getSpots } from "../../store/spots";
import './Spots.css'
import { NavLink } from "react-router-dom";


const AllSpots = () => {
    const dispatch = useDispatch()
    const spots = useSelector(state => state.spots.allSpots)
    const spotsArray = Object.values(spots)



    useEffect(() => {
        const refresh = async () => {
            await dispatch(getSpots())
        }
        refresh()
    }, [dispatch])


    return spotsArray && spots && (
        <div className="spotsPage">
            <div className="eachSpot">
                {spotsArray.map((spot) => (
                    <div
                        className='spotCard' key={spot?.id}>
                        <NavLink to={`/spots/${spot?.id}`}>
                            <div className="room">
                                <div className="imgDiv">
                                    <img className="spotImg" src={spot?.previewImage}></img>
                                </div>
                                <div className="roomDetails">
                                    <div className="roomData">
                                        <div className="spotLocationContainer">
                                            <h3>{spot?.name}</h3>
                                            <div className="spot-city">
                                                {spot?.city}, {spot?.state}

                                            </div>
                                            <div className="price-per-night">
                                                <h3>
                                                    $
                                                    {spot?.price}
                                                </h3>
                                                <span>night</span>

                                            </div>
                                        </div>
                                        <div className="star-container">
                                            <span className="starReview">
                                                <i className="fa-sharp fa-solid fa-star"></i>
                                                <span>{spot?.avgRating}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </NavLink>
                    </div>
                ))}
            </div>
        </div >
    )
}
export default AllSpots
