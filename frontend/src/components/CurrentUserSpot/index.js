import React from "react";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { getCurrentUserSpot } from "../../store/spots";
import './CurrentUserSpot.css'
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";


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
            <h2 className="MySpot">Manage Your Spots</h2>
            <Link to={'/spots/new'}>
                <button type="button" className="current-create-a-spot">Create a New Spot</button>
            </Link>
            <div className="spotContainer">
                <div className="spotDetail">
                    {spotsArray.map((spot) => (
                        <div className="my-spot" key={spot.id} >
                            <div className="spotDetails">
                                <div>{spot.name}</div>
                                <img className="imgDetail" src={spot.previewImage} onClick={() => handleCLick(spot)} alt={spot.name} />
                                <div className="footer-area">{spot.city}, {spot.state}<span className="starReview">
                                    <i className="fa-sharp fa-solid fa-star"></i>
                                    <span>{spot.avgRating}</span>
                                </span>
                                </div>
                                <div>
                                    <span>
                                        ${spot.price} night
                                    </span>
                                    <span>
                                        <Link to={`/spots/${spot.id}/edit`}>
                                            <button>Update</button>
                                        </Link>
                                        <button>Delete</button>
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CurrentUserSpot
