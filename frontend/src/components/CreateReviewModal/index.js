import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { postAReview } from "../../store/reviews";
import { getDetailOfSpot } from "../../store/spots";

const CreateReview = () => {
  const dispatch = useDispatch();

  const [review, setReview] = useState('')
  const [stars, setStars] = useState(0)
  const [errors, setErrors] = useState([])
  return (
    <div>aa</div>
  )
}

export default CreateReview
