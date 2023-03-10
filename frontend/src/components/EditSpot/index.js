import React from "react";
import './EditSpot.css'
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { editASpot } from "../../store/spots";
import { getSpots } from "../../store/spots";
import { createASpot } from "../../store/spots";


const EditSpot = () => {
    const user = useSelector((state) => state.session.user)

    const history = useHistory()
    const dispatch = useDispatch()
    const { spotId } = useParams()
    const spot = useSelector(state => state.spots.allSpots)
    const [country, setCountry] = useState(spot[spotId]?.country)
    const [address, setAddress] = useState(spot[spotId]?.address)
    const [city, setCity] = useState(spot[spotId]?.city)
    const [state, setState] = useState(spot[spotId]?.state)
    const [latitude, setLatitude] = useState(spot[spotId]?.lat)
    const [longitude, setLongitude] = useState(spot[spotId]?.lng)
    const [description, setDescription] = useState(spot[spotId]?.description)
    const [name, setName] = useState(spot[spotId]?.name)
    const [price, setPrice] = useState(spot[spotId]?.price)
    const [previewImage, setPreviewImage] = useState(spot[spotId]?.previewImage)
    const [errors, setErrors] = useState({})

    const userIsLoggedIn = !!(user?.id)
    const spotBelongsToUser = (user || {}).id === spot[spotId]?.ownerId


    if (!userIsLoggedIn || !spotBelongsToUser) {
        history.push('/')
        return
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const errors = {}
        if (!country) errors['country'] = 'Country is required'
        if (!address) errors['address'] = 'Address is required'
        if (!city) errors['city'] = 'City is required'
        if (!state) errors['state'] = 'State is required'
        if (!latitude) errors['latitude'] = 'Latitude is required'
        if (!longitude) errors['longitude'] = 'Longitude is required'
        if (description.length < 30) errors['description'] = 'Description needs a minimum of 30 characters'
        if (!name) errors['name'] = 'Name is required'
        if (!price) errors['price'] = 'Price is required'
        // if (!previewImage || previewImage === '') errors['previewImage'] = 'Preview image is required'
        // if (!previewImage.endsWith('.png') && !previewImage.endsWith('.jpg') && !previewImage.endsWith('.jpeg')) errors['previewImage'] = 'Preview image URL must end in .png, .jpg, or .jpeg'
        // if (!imageURL.includes('.png')) errors['imageURL'] = 'Image URL must end in .png, .jpg, or .jpeg'

        // if (!imageURL.includes('.jpg')) errors['imageURL'] = 'Image URL must end in .png, .jpg, or .jpeg'

        // if (!imageURL.includes('.jpeg')) errors['imageURL'] = 'Image URL must end in .png, .jpg, or .jpeg'

        // // || !imageURL.includes('.jpg', imageURL.lastIndexOf())
        // // || !imageURL.includes('.jpeg', imageURL.lastIndexOf()))



        if (Object.keys(errors).length > 0) {
            setErrors(errors)
            return
        }

        const data = {
            country: country,
            address: address,
            city: city,
            state: state,
            lat: latitude,
            lng: longitude,
            description: description,
            name: name,
            price: price,
        }

        const image = []
        const firstImage = {
            url: previewImage,
            preview: true
        }
        image.push(firstImage)

        const editedSpot = editASpot(data, image, spot[spotId].id)
        dispatch(editedSpot)


        if (editedSpot) {
            history.push(`/spots/${spotId}`)
            return
        }
    }


    return spot && (
        <div className="form-container">
            <h1>Update your Spot</h1>
            <form className="spot-form"
                onSubmit={handleSubmit}>
                <div>Where's your place located?</div>
                <div>Guests will only get your exact address once they booked a reservation.</div>
                <div className="country-container">
                    <div>Country</div>
                    <input type="text" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
                    {errors['country'] && <div>{errors['country']}</div>}
                </div>
                <div className="address-container">
                    <div>Street Address</div>
                    <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
                    {errors['address'] && <div>{errors['address']}</div>}
                </div>
                <div className="city-container">
                    <div>City</div>
                    <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
                    {errors['city'] && <div>{errors['city']}</div>}
                </div>
                <div className="state-container">
                    <div>State</div>
                    <input type="text" placeholder="STATE" value={state} onChange={(e) => setState(e.target.value)} />
                    {errors['state'] && <div>{errors['state']}</div>}
                </div>
                {/* <div className="lat-container">
                    <div>Latitude</div>
                    <input type="number" placeholder="Latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
                    {errors['latitude'] && <div>{errors['latitude']}</div>}
                </div>
                <div className="lng-container">
                    <div>Longitude</div>
                    <input type="number" placeholder="Longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
                    {errors['longitude'] && <div>{errors['longitude']}</div>}
                </div> */}
                <hr></hr>
                <h2>Describe your place to guests</h2>
                <div>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood</div>
                <div className="description-container">
                    <textarea type="text" placeholder="Please write at least 30 characters" value={description} onChange={(e) => setDescription(e.target.value)} />
                    {errors['description'] && <div>{errors['description']}</div>}
                </div>
                <hr></hr>
                <h2>Create a title for your spot</h2>
                <div>Catch guests' attention with a spot title that highlights what makes your place special.</div>
                <div className="name-container">

                    <input type="text" placeholder="Name of your spot" value={name} onChange={(e) => setName(e.target.value)} />
                    {errors['name'] && <div>{errors['name']}</div>}
                </div>
                <hr></hr>
                <h2>Set a base price for your spot</h2>
                <div>Competitive pricing can help your listing stand out and rank higher in search results</div>
                <div className="price-container">
                    <span><b>$ </b><input type="number" placeholder="Price per night (USD)" value={price} onChange={(e) => setPrice(e.target.value)} /></span>
                    {errors['price'] && <div>{errors['price']}</div>}
                </div>
                {/* <hr></hr>
                <h2>Liven up your spot with photos</h2>
                <div>Submit a link to at least one photo to publish your spot</div> */}
                {/* <div className="prev-img-container">
                    <input type="text" placeholder="Preview Image URL" value={previewImage} onChange={(e) => setPreviewImage(e.target.value)} />
                    {errors['previewImage'] && <div>{errors['previewImage']}</div>}
                </div> */}
                {/* <div className="img-container"> */}
                {/* <input type="text" placeholder="Image URL" value={imageURL} onChange={(e) => setImageURL(e.target.value)} />
                    {errors['imageURL'] && <div>{errors['imageURL']}</div>}
                </div>
                <input type="text" placeholder="Image URL" value={imageURL2} onChange={(e) => setImageURL2(e.target.value)} />
                <input type="text" placeholder="Image URL" value={imageURL3} onChange={(e) => setImageURL3(e.target.value)} />
                <input type="text" placeholder="Image URL" value={imageURL4} onChange={(e) => setImageURL4(e.target.value)} /> */}

                <br></br>
                <br></br>
                <button className="createSpot" type="submit">Update Your Spot</button>
            </form>
        </div>
    )
}

export default EditSpot
