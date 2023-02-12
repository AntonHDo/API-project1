import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getSpots } from "../../store/spots";
import './Spots.css'
import { NavLink } from "react-router-dom";
const AllSpots = () => {
    const dispatch = useDispatch()
    const spots = useSelector(state => state.spots)
    const spotsArray = Object.values(spots)
    console.log(spotsArray[0].id)

    useEffect(() => {
        dispatch(getSpots())
    }, [dispatch])
    return (
        <div className="spotsPage">
            <div className="eachSpot">
                {spotsArray.map(spot => (
                    <div className='spotCard' key={spot.id}>
                        <NavLink to={`/spots/${spot.id}`}>
                            sup
                        </NavLink>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AllSpots
