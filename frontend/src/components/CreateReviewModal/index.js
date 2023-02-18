import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { postAReview } from "../../store/reviews";
import { getDetailOfSpot } from "../../store/spots";
import { getCurrentReviews } from "../../store/reviews";

const CreateReviewModal = ({ id, createReview }) => {
  const user = useSelector((state) => state.session.user)
  const spot = useSelector((state) => state.spots.singleSpot)
  const reviews = useSelector((state) => state.reviews.user)
  const dispatch = useDispatch();
  const { closeModal } = useModal()
  const [review, setReview] = useState('')
  const [stars, setStars] = useState(0)
  const [errors, setErrors] = useState([])
  const [disableBtn, setDisableBtn] = useState(true)
  const [reviewError, setReviewError] = useState(false)
  const [starError, setStarError] = useState(false)
  const [btnClassName, setBtnClassName] = useState("disabled")


  useEffect(() => {
    if (review.length < 10) {
      setDisableBtn(true)
      setBtnClassName("disabled")
      return
    }
    if (stars === 0) {
      setDisableBtn(true)
      setBtnClassName("disabled")
      return
    }
    setBtnClassName("enabled")
    setDisableBtn(false)
  }, [review, stars])

  const handleSubmit = async (e) => {
    e.preventDefault()

    setErrors([])
    setReviewError(false)
    setStarError(false)

    if (review.length < 10) {
      errors.push('Input Error')
      setReviewError(true)
    }

    if (stars === 0) {
      errors.push('Input Error')
      setStarError(true)
    }
    if (errors.length > 0) return



    const data = {
      id,
      stars: stars,
      review
    }

    createReview(spot.id, data)
    closeModal()
  }

  const handleStars1 = async (e) => {
    e.preventDefault()
    setStars(1)
  }
  const handleStars2 = async (e) => {
    e.preventDefault()
    setStars(2)
  }
  const handleStars3 = async (e) => {
    e.preventDefault()
    setStars(3)
  }
  const handleStars4 = async (e) => {
    e.preventDefault()
    setStars(4)
  }
  const handleStars5 = async (e) => {
    e.preventDefault()
    setStars(5)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>How was your stay {user?.firstName}?</h2>
        <div>
          <textarea type='text' placeholder="Leave your review here..." value={review} onChange={(e) => setReview(e.target.value)} />
        </div>
        <div>
          <button onClick={handleStars1} value={stars}><i className="fa-sharp fa-solid fa-star"></i></button>
          <button onClick={handleStars2} value={stars}><i className="fa-sharp fa-solid fa-star"></i></button>
          <button onClick={handleStars3} value={stars}><i className="fa-sharp fa-solid fa-star"></i></button>
          <button onClick={handleStars4} value={stars}><i className="fa-sharp fa-solid fa-star"></i></button>
          <button onClick={handleStars5} value={stars}><i className="fa-sharp fa-solid fa-star"></i></button>
          Stars
        </div >
        <div>
          <button className={btnClassName} type="submit" onClick={handleSubmit} disabled={disableBtn} >Submit Your Review</button>
        </div>
      </form >
    </div >
  )
}

export default CreateReviewModal
