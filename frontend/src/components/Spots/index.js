import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getSpots } from "../../store/spots";
import './Spots.css'
import { NavLink } from "react-router-dom";
const AllSpots = () => {
    const dispatch = useDispatch()
    const spots = useSelector(state => state.spots)
    const spotsArray = Object.values(spots)


    useEffect(() => {
        dispatch(getSpots())
    }, [dispatch])
    return (
        <div className="spotsPage">
            <div className="eachSpot">
                {spotsArray.map(spot => (
                    <div className='spotCard' key={spot.id}>
                        <NavLink to={`/spots/${spot.id}`}>
                            <div className="room">
                                <div className="imgDiv">
                                    <img className="spotImg" src={spot.previewImage}></img>
                                </div>
                                <div className="roomDetails">
                                    <div className="roomData">
                                        <div className="spotLocation">
                                            <div className="spot-city">
                                                {spot.city},{spot.state}
                                            </div>
                                            <div className="spotStars">
                                                <div className="star">
                                                    starSpot {spot.id}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </NavLink>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AllSpots
