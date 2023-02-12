import React from "react";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { getCurrentUserSpot } from "../../store/spots";
import './CurrentUserSpot.css'
import { useSelector, useDispatch } from "react-redux";



const CurrentUserSpot = () => {
    const history = useHistory()
    const dispatch = useDispatch()
    const spots = useSelector(state => state.spots)
    const spotsArray = Object.values(spots)
    console.log("this Spot", spotsArray)

    useEffect(() => {
        dispatch(getCurrentUserSpot())
    }, [dispatch])

    const handleCLick = (spot) => {
        history.push(`/spots/${spot.id}`)
    }

    return (
        <div>
            <h2 className="MySpot">My Spot</h2>
            <div className="spotContainer">
                <div className="spotDetail">
                    {spotsArray.map((spot) => (
                        <div className="my-spot" key={spot.id} onClick={() => handleCLick(spot)}>
                            <div className="spotDetails">
                                <div>{spot.name}</div>
                                <img className="imgDetail" src={spot.previewImage} alt={spot.name} />
                                <div className="footer-area">{spot.city} {spot.state}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CurrentUserSpot
