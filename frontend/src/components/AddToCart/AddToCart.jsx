import React, { useState } from "react";
import { IconButton, Typography, Button } from "@mui/material";
import { addToCart } from "../../redux/actions/cartActions";
import AddShoppingCart from "@mui/icons-material/AddShoppingCart";
import ModalMessage from "../Modal/ModalMessage";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
// ========================================
const AddToCart = ({ product }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [message, setMessage] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const handleAddToCart = () => {
    if (!user) {
      setMessage("Please login to add to cart");
      setOpenModal(true);
    } else {
      dispatch(addToCart(product));
      setOpenModal(true);
      setMessage(
        "The product has been successfully added to the shopping cart."
      );
    }
    setTimeout(() => {
      setOpenModal(false);
      setMessage("");
    }, 1500);
  };

  // --------------------------------------
  const location = useLocation();
  const isCart = location.pathname.includes("/cart");
  const isProduct = location.pathname.includes("/product");
  // ------------------------------
  return (
    <section className="addToCart">
      {isProduct ? (
        <Button color="primary" variant="contained" onClick={handleAddToCart}>
          Add to cart
        </Button>
      ) : (
        <IconButton onClick={handleAddToCart} className="addToCartButton">
          <AddShoppingCart color="primary" />
        </IconButton>
      )}
      <ModalMessage open={openModal} message={message}></ModalMessage>
    </section>
  );
};

export default AddToCart;
