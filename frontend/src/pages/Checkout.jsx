import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Container, Box, Typography, Button, Paper } from "@mui/material";
import axios from "axios";
// -------------------------------------
const Checkout = () => {
  const cartItems = useSelector((state) => state.cart);
  const user = useSelector((state) => state.auth.user);
  const [formData, setFormData] = useState({});
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const [successMessage, setSuccessMessage] = useState();
  const [order, setOrder] = useState();
  // --------------------------
  useEffect(() => {
    if (user) {
      setFormData({
        user: user.id,
        products: cartItems.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: totalPrice,
      });
    }
  }, [user, cartItems, totalPrice]);
  // --------------------------
  useEffect(() => {
    if (order) {
      const fetchOrder = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/orders/${order}`
          );
          console.log("Order found", response.data);
        } catch (error) {
          console.log(`Error: ${error.message}`);
        }
      };
      fetchOrder();
    }
  }, [order]);
  const handleConfirmOrder = async () => {
    if (user) {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/orders`,
          formData
        );
        if (response.status === 201) {
          setSuccessMessage("Order placed successfully!");
          setOrder(response.data._id);
          console.log("Order id:", response.data._id);
          setTimeout(() => {
            setSuccessMessage("");
          }, 2000);
        }
      } catch (error) {
        console.log(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div className="pageContent">
      <Container maxWidth="sm">
        {user ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mt: 4,
              mb: 4,
            }}
          >
            <Paper sx={{ padding: 3, width: "100%" }}>
              <Typography variant="h4" gutterBottom>
                Making an order
              </Typography>
              <Typography variant="h6">Name: {user.name}</Typography>
              <Typography variant="h6">Email: {user.email}</Typography>

              <Typography variant="h5" sx={{ mt: 4 }}>
                Products in the order:
              </Typography>
              {cartItems.map((item) => (
                <Box key={item._id} sx={{ marginBottom: 2 }}>
                  <Typography variant="h6">
                    {item.name} x {item.quantity}
                  </Typography>
                  <Typography variant="body1">
                    Price: {item.price} $.
                  </Typography>
                </Box>
              ))}

              <Typography variant="h6" sx={{ mt: 2 }}>
                Total Price: {totalPrice} $.
              </Typography>
              {successMessage && (
                <Typography color="success">{successMessage}</Typography>
              )}
              <Button
                variant="contained"
                color="primary"
                onClick={handleConfirmOrder}
                sx={{ mt: 2 }}
              >
                Confirm the order
              </Button>
            </Paper>
          </Box>
        ) : (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Typography variant="h6">
              Please log in to make an order.
            </Typography>
          </Box>
        )}
      </Container>
    </div>
  );
};

export default Checkout;
