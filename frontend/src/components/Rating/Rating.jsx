import React from "react";
import axios from "axios";
import { setProducts } from "../../redux/actions/productsActions";
import { Rating, Typography } from "@mui/material";
import { useDispatch } from "react-redux";

// ==========================
const RatingComponent = ({ product, products }) => {
  const dispatch = useDispatch();
  const handleRatingChange = async (event, newValue, product) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/products/rate`,
        {
          productId: product._id,
          rating: newValue,
        }
      );
      console.log("Rating updated:", response.data.product.rating);
      dispatch(
        setProducts(
          products.map((prod) =>
            prod._id === product._id
              ? { ...prod, rating: response.data.product.rating }
              : prod
          )
        )
      );
    } catch (error) {
      console.error("Error updating rating:", error);
    }
  };

  return (
    <div
      className="rating-block"
      style={{
        display: "flex",
        flexDirection: "column",
        margin: "10px 0",
      }}
    >
      <Rating
        onChange={(e, newValue) =>
          handleRatingChange(e, newValue || 5, product)
        }
        value={product.rating}
        precision={0.5}
      />
      <Typography variant="p">
        Average rating: <span>{product.rating || 0} / 5</span>
      </Typography>
    </div>
  );
};

export default RatingComponent;
