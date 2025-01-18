import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../redux/actions/authActions";
import { clearCart } from "../../redux/actions/cartActions";
import { Button, Box } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link, useLocation } from "react-router-dom";
// =============================

const HeaderMenu = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const [numberProducts, setNumberProducts] = useState(0);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = user !== null;
  const [actPoint, setActPoint] = useState("");
  const handlerActPoint = (point) => {
    setActPoint(point);
  };
  let temp = useSelector((state) => state.cart);

  useEffect(() => {
    setNumberProducts(temp.length);
  }, [temp]);
  // -----------------------------
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    dispatch(setUser(null, null));
    dispatch(clearCart());
  };
  useEffect(() => {
    const path = location.pathname.split("/")[1] || "home";
    setActPoint(path);
  }, [location]);

  // -------------------
  return (
    <div>
      <Button
        color="inherit"
        component={Link}
        to="/"
        onClick={(e) => {
          handlerActPoint("home");
        }}
        style={{ color: actPoint === "home" ? "red" : "" }}
      >
        Home
      </Button>
      {!isAuthenticated ? (
        <>
          <Button
            color="inherit"
            component={Link}
            to="/login"
            onClick={(e) => {
              handlerActPoint("login");
            }}
            style={{ color: actPoint === "login" ? "red" : "" }}
          >
            Login
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/register"
            onClick={(e) => {
              handlerActPoint("register");
            }}
            style={{ color: actPoint === "register" ? "red" : "" }}
          >
            Register
          </Button>
        </>
      ) : (
        <>
          <div>
            <Button
              color="inherit"
              component={Link}
              to="/profile"
              onClick={(e) => {
                handlerActPoint("profile");
              }}
              style={{ color: actPoint === "profile" ? "red" : "" }}
            >
              Hello, <h3>{user ? user.name : "user"}</h3>, see Profile
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </>
      )}
      <Box
        className="cart-icon"
        component={Link}
        to="/cart"
        onClick={(e) => {
          handlerActPoint("card");
        }}
        style={{ color: actPoint === "card" ? "red" : "" }}
      >
        <div>
          <ShoppingCartIcon />
        </div>
        <span className="cart-badge">{numberProducts}</span>
      </Box>
      {isAdmin && (
        <Button
          color="inherit"
          component={Link}
          to="/admin"
          onClick={(e) => {
            handlerActPoint("admin");
          }}
          style={{ color: actPoint === "admin" ? "red" : "" }}
        >
          admin
        </Button>
      )}
    </div>
  );
};

export default HeaderMenu;
