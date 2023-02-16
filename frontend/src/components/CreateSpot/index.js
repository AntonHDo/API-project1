import React from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { createASpot } from "../../store/spots";
import { createImageForSpot } from "../../store/spots";
import './CreateSpot.css'

const CreateSpot = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const spots = useSelector(state => state.spots.singleSpot)
    const [country, setCountry] = useState('')
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [latitude, setLatitude] = useState(1)
    const [longitude, setLongitude] = useState(1)
    const [description, setDescription] = useState('')
    const [name, setName] = useState('')
    const [price, setPrice] = useState(1)
    const [previewImage, setPreviewImage] = useState('')
    const [imageURL, setImageURL] = useState('')
    const [imageURL2, setImageURL2] = useState('')
    const [imageURL3, setImageURL3] = useState('')
    const [imageURL4, setImageURL4] = useState('')
    const [errors, setErrors] = useState({})


    const handleSubmit = (e) => {
        e.preventDefault()
        const errors = {}
        if (!country) errors['country'] = 'Country is required'
        if (!address) errors['address'] = 'Address is required'
        if (!city) errors['city'] = 'City is required'
        if (!state) errors['state'] = 'State is required'
        // if (!latitude) errors['latitude'] = 'Latitude is required'
        // if (!longitude) errors['longitude'] = 'Longitude is required'
        if (description.length < 30) errors['description'] = 'Description needs a minimum of 30 characters'
        if (!name) errors['name'] = 'Name is required'
        if (!price) errors['price'] = 'Price is required'
        // if (!previewImage) errors['previewImage'] = 'Preview image is required'
        // if (!imageURL.includes('.png')) errors['imageURL'] = 'Image URL must end in .png, .jpg, or .jpeg'


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

        // const data = {
        //     spot: {
        //         country: country,
        //         address: address,
        //         city: city,
        //         state: state,
        //         lat: latitude,
        //         lng: longitude,
        //         description: description,
        //         name: name,
        //         price: price,
        //     },
        //     images: [{
        //         preview: true,
        //         url: previewImage,
        //     },
        //     {
        //         preview: false,
        //         url: imageURL
        //     },
        //     {
        //         preview: false,
        //         url: imageURL2
        //     },
        //     {
        //         preview: false,
        //         url: imageURL3
        //     },
        //     {
        //         preview: false,
        //         url: imageURL4
        //     },
        //     ]
        // }

        dispatch(createASpot(data))

        history.push(`/spots/${spots.id}`)
    }

    // if (submit) {
    //     return <Redirect to={'/'} />
    // }

    // const validationErrors = validation();
    // if (validationErrors.length > 0) {
    //     setErrors(validationErrors)
    //     return;
    // }

    return (
        <div className="form-container">
            <h1>Create a new Spot</h1>
            <form className="spot-form"
                onSubmit={handleSubmit}>
                <div className="form-group">
                    <h3>Where's your place located?</h3>
                    <div className="form-description">Guests will only get your exact address once they booked a reservation.</div>
                    <div className="country-container">
                        <h3>Country</h3>
                        <input type="text" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
                        {errors['country'] && <div className="form-error">{errors['country']}</div>}
                    </div>
                    <div className="address-container">
                        <h3>Street Address</h3>
                        <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
                        {errors['address'] && <div className="form-error">{errors['address']}</div>}
                    </div>
                    <div className="city-container">
                        <h3>City</h3>
                        <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
                        {errors['city'] && <div className="form-error">{errors['city']}</div>}
                    </div>
                    <div className="state-container">
                        <h3>State</h3>
                        <input type="text" placeholder="STATE" value={state} onChange={(e) => setState(e.target.value)} />
                        {errors['state'] && <div className="form-error">{errors['state']}</div>}
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
                </div>
                <div className="form-group">
                    <h2>Describe your place to guests</h2>
                    <div className="form-description">Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood</div>
                    <div className="description-container">
                        <input type="text" placeholder="Please write at least 30 characters" value={description} onChange={(e) => setDescription(e.target.value)} />
                        {errors['description'] && <div className="form-error">{errors['description']}</div>}
                    </div>
                    <hr></hr>
                </div>
                <div className="form-group">
                    <h2>Create a title for your spot</h2>
                    <div className="form-description">Catch guests' attention with a spot title that highlights what makes your place special.</div>
                    <div className="name-container">

                        <input type="text" placeholder="Name of your spot" value={name} onChange={(e) => setName(e.target.value)} />
                        {errors['name'] && <div className="form-error">{errors['name']}</div>}
                    </div>
                    <hr></hr>
                </div>
                <div className="form-group">
                    <h2>Set a base price for your spot</h2>
                    <div className="form-description">Competitive pricing can help your listing stand out and rank higher in search results</div>
                    <div className="price-container">
                        <span><b>$ </b><input type="number" placeholder="Price per night (USD)" value={price} onChange={(e) => setPrice(e.target.value)} /></span>
                        {errors['price'] && <div className="form-error">{errors['price']}</div>}
                    </div>
                    <hr></hr>
                </div>
                <div className="form-group">
                    <h2>Liven up your spot with photos</h2>
                    <div className="form-description">Submit a link to at least one photo to publish your spot</div>
                    <div className="prev-img-container">
                        <input type="text" placeholder="Preview Image URL" value={previewImage} onChange={(e) => setPreviewImage(e.target.value)} />
                        {errors['previewImage'] && <div className="form-error">{errors['previewImage']}</div>}
                    </div>
                    <div className="img-container">
                        <input type="text" placeholder="Image URL" value={imageURL} onChange={(e) => setImageURL(e.target.value)} />
                        {errors['imageURL'] && <div className="form-error">{errors['imageURL']}</div>}
                    </div>
                    <input type="text" placeholder="Image URL" value={imageURL2} onChange={(e) => setImageURL2(e.target.value)} />
                    <input type="text" placeholder="Image URL" value={imageURL3} onChange={(e) => setImageURL3(e.target.value)} />
                    <input type="text" placeholder="Image URL" value={imageURL4} onChange={(e) => setImageURL4(e.target.value)} />

                    <hr></hr>
                </div>
                <button className="createSpot" type="submit">Create Spot</button>
            </form>
        </div>
    )
}

export default CreateSpot
