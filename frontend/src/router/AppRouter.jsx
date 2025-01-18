import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import Cart from "../pages/Cart/Cart";
import AdminPage from "../pages/AdminPage/AdminPage";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Profile from "../pages/Profile/Profile";
import Checkout from "../pages/Checkout";
import ContactForm from "../pages/Contacts/Contacts";
import Shop from "../pages/Shop";

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/product/:id" element={<ProductDetails />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/admin" element={<AdminPage />} />
    <Route path="/shop" element={<Shop />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/checkout" element={<Checkout />} />
    <Route path="/contacts" element={<ContactForm />} />
  </Routes>
);

export default AppRouter;
