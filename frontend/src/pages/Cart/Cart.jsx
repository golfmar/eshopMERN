import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  List,
  Card,
  Divider,
  Typography,
  CardMedia,
  Box,
} from "@mui/material";
import "./Cart.scss";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
// =====================actions====================
import {
  removeFromCart,
  deliteFromCart,
  clearCart,
  addToCart,
} from "../../redux/actions/cartActions";
// =======================================================

const Cart = () => {
  const cartItems = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  cartItems.map((item) => console.log(item));
  // Удалить товар из корзины
  const handleDeleteFromCart = (productId) => {
    dispatch(deliteFromCart(productId));
  };

  // Очистить корзину
  const handleClearCart = () => {
    dispatch(clearCart());
  };

  // Увеличить количество товара
  const handleIncreaseQuantity = (productId) => {
    dispatch(addToCart({ _id: productId })); // Увеличиваем количество товара
  };

  // Уменьшить количество товара
  const handleDecreaseQuantity = (productId) => {
    dispatch(removeFromCart(productId)); // Уменьшаем количество товара
  };

  // Рассчитываем общую сумму
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  // Переход на страницу оформления заказа
  const handleCheckout = () => {
    navigate("/checkout"); // Переходим на страницу оформления заказа
  };
  return (
    <div className="pageContent">
      <Typography variant="h3" gutterBottom>
        Cart
      </Typography>
      <List className="productList">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <Card key={item._id} className="productItem">
              <CardMedia
                component="img"
                image={item.image}
                alt={item.name}
                className="productImage"
              />
              <Box className="productContent">
                <Typography variant="h4">{item.name}</Typography>
                <Typography variant="p">Price: {item.price} $.</Typography>
                <Typography variant="p">
                  Description: {item.description}.
                </Typography>
                <Typography variant="p">
                  Category: {item.category ? item.category.name : "No category"}
                </Typography>
                <Typography variant="p">Quantity:</Typography>
                <Typography variant="p" className="cardPrice">
                  <span onClick={() => handleDecreaseQuantity(item._id)}>
                    -
                  </span>
                  {item.quantity}
                  <span onClick={() => handleIncreaseQuantity(item._id)}>
                    +
                  </span>
                </Typography>

                <Button
                  className="deliteButton"
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                  color="denger"
                  onClick={() => handleDeleteFromCart(item._id)}
                >
                  Delite product from the cart
                </Button>
              </Box>
            </Card>
          ))
        ) : (
          <Typography variant="body1">The kart is empty.</Typography>
        )}
      </List>
      <Divider />
      {cartItems.length > 0 && (
        <>
          <Typography variant="h6" style={{ marginTop: 10 }}>
            Total price: {totalPrice} $.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: "10px" }}
            onClick={handleCheckout}
          >
            Place an order
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleClearCart}
            style={{ marginTop: "10px", marginLeft: "10px" }}
          >
            Empty the kart
          </Button>
        </>
      )}
    </div>
  );
};

export default Cart;
