import React from "react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { createASpot } from "../../store/spots";
import { getSpots } from "../../store/spots";
import { createImageForSpot } from "../../store/spots";
import { Redirect } from "react-router-dom";
import './CreateSpot.css'

const CreateSpot = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const spots = useSelector(state => state.spots)
    const [country, setCountry] = useState('')
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [latitude, setLatitude] = useState('')
    const [longitude, setLongitude] = useState('')
    const [description, setDescription] = useState('')
    const [title, setTitle] = useState('')
    const [price, setPrice] = useState(1)
    const [previewImage, setPreviewImage] = useState('')
    const [imageURL, setImageURL] = useState('')
    const [imageURL2, setImageURL2] = useState('')
    const [imageURL3, setImageURL3] = useState('')
    const [imageURL4, setImageURL4] = useState('')
    const [submit, setSubmit] = useState(false)
    const [errors, setErrors] = useState({})



    // useEffect(() => {
    //     dispatch(getSpots())
    // }, [dispatch])

    // const validations = () => {
    //     const errors = [];
    //     if (!country) errors.push('Country is required')
    //     if (!address) errors.push('Address is required')
    //     if (!city) errors.push('City is required')
    //     if (!state) errors.push('State is required')
    //     if (!latitude) errors.push('Latitude is required')
    //     if (!longitude) errors.push('Longitude is required')
    //     if (description.length < 30) errors.push('Description needs a minimum of 30 characters')
    //     if (!title) errors.push('Name is required')
    //     if (!price) errors.push('Price is required')
    //     if (!previewImage) errors.push('Preview image is required')
    //     if (!imageURL.includes('.png', imageURL.length - 1) || !imageURL.includes('.jpg', imageURL.length - 1) || imageURL.includes('.jpeg', imageURL.length - 1)) errors.push('Image URL must end in .png, .jpg, or .jpeg')
    //     return errors
    // }

    const handleSubmit = (e) => {
        e.preventDefault()
        const errors = {
            // country: "error" || "",
            // address: "error" || "",
            // city: "error" || "",
            // state: "error" || "",
            // latitude: "error" || "",
            // longitude: "error" || "",
            // description: "error" || "",
            // title: "error" || "",
            // price: "error" || "",
            // previewImage: "error" || "",
            // city: "error" || "",
        }

        if (!country) errors['country'] = 'Country is required'
        if (!address) errors['address'] = 'Address is required'
        if (!city) errors['city'] = 'City is required'
        if (!state) errors['state'] = 'State is required'
        if (!latitude) errors['latitude'] = 'Latitude is required'
        if (!longitude) errors['longitude'] = 'Longitude is required'
        if (description.length < 30) errors['description'] = 'Description needs a minimum of 30 characters'
        if (!title) errors['title'] = 'Name is required'
        if (!price) errors['price'] = 'Price is required'
        if (!previewImage) errors['previewImage'] = 'Preview image is required'
        // if (!imageURL.includes('.png', imageURL.length - 1) || !imageURL.includes('.jpg', imageURL.length - 1) || imageURL.includes('.jpeg', imageURL.length - 1)) errors[''] = 'Image URL must end in .png, .jpg, or .jpeg'

        console.log("errors:", errors)

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
            name: title,
            price: price,
            previewImage: previewImage,
            imageURL: imageURL,
            imageURL2: imageURL2,
            imageURL3: imageURL3,
            imageURL4: imageURL4
        }

        dispatch(createASpot(data))

        history.push('/')
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
                <div>Where's your place located?</div>
                <div>Guests will only get your exact address once they booked a reservation.</div>

                {/* <ul className='spot-form-error'>
                    {errors.map((error) => (
                        <li key={error}> {error}</li>
                    ))}
                </ul> */}
                <div className="country-container">
                    <div>Country</div>
                    <input type="text" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
                    {errors['country'] && <div>{errors['country']}</div>}
                </div>
                <div>Street Address</div>
                <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
                <div>City</div>
                <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
                <div>State</div>
                <input type="text" placeholder="STATE" value={state} onChange={(e) => setState(e.target.value)} />
                <div>Latitude</div>
                <input type="text" placeholder="Latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
                <div>Longitude</div>
                <input type="text" placeholder="Longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
                <hr></hr>
                <h2>Describe your place to guests</h2>
                <div>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood</div>
                <input type="text" placeholder="Please write at least 30 characters" value={description} onChange={(e) => setDescription(e.target.value)} />
                <hr></hr>
                <h2>Create a title for your spot</h2>
                <div>Catch guests' attention with a spot title that highlights what makes your place special.</div>
                <input type="text" placeholder="Name of your spot" value={title} onChange={(e) => setTitle(e.target.value)} />
                <hr></hr>
                <h2>Set a base price for your spot</h2>
                <div>Competitive pricing can help your listing stand out and rank higher in search results</div>
                <span><b>$ </b><input type="number" placeholder="Price per night (USD)" value={price} onChange={(e) => setPrice(e.target.value)} /></span>
                <hr></hr>
                <h2>Liven up your spot with photos</h2>
                <div>Submit a link to at least one photo to publish your spot</div>
                <input type="text" placeholder="Preview Image URL" value={previewImage} onChange={(e) => setPreviewImage(e.target.value)} />
                <input type="text" placeholder="Image URL" value={imageURL} onChange={(e) => setImageURL(e.target.value)} />
                <input type="text" placeholder="Image URL" value={imageURL2} onChange={(e) => setImageURL2(e.target.value)} />
                <input type="text" placeholder="Image URL" value={imageURL3} onChange={(e) => setImageURL3(e.target.value)} />
                <input type="text" placeholder="Image URL" value={imageURL4} onChange={(e) => setImageURL4(e.target.value)} />
                <hr></hr>
                <button className="createSpot" type="submit">Create Spot</button>
            </form>
        </div>
    )
}

export default CreateSpot
