import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProductReview } from "../../app/slices/prouctReviewSlice";
import { closeProductReviewModal } from "../../app/slices/prouctReviewSlice";

export default function AddProductReviewModel() {
  const dispatch = useDispatch();
  const { isOpen } = useSelector((state) => state.productReview);

  const [formData, setFormData] = useState({
    stars: "",
    reviewText: "",
    image: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log(formData)
    const reviewData = new FormData();
    reviewData.append("stars", formData.stars);
    reviewData.append("reviewText", formData.reviewText);
    reviewData.append("image", formData.image);
    const result = await dispatch(addProductReview(reviewData));
   
    console.log(result)
  };

  return (
    <div
      className={`${
        isOpen ? "block" : "hidden"
      } fixed top-0 left-0 w-full h-full bg-black/20 bg-opacity-50 flex justify-center items-center z-50`}
    >
      <div className="bg-white p-4 rounded-lg">
        <div>
          <button onClick={() => dispatch(closeProductReviewModal())}>
            Close
          </button>
        </div>
        <div>
          <h2>Add Product Review</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="stars">Stars</label>
            <input
              type="number"
              id="stars"
              name="stars"
              value={formData.stars}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="reviewText">Review Text</label>
            <textarea
              id="reviewText"
              name="reviewText"
              value={formData.reviewText}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="image">Image</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
            />
          </div>
          <button type="submit">Add Review</button>
        </form>
      </div>
    </div>
  );
}
