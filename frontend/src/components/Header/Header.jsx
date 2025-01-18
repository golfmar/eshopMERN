import React, { useState, useEffect } from "react";
import { ReactComponent as Rt } from "../../assets/react.svg";
import { ReactComponent as No } from "../../assets/nodejs.svg";
import { ReactComponent as Ex } from "../../assets/express.svg";
import { ReactComponent as Md } from "../../assets/mongodb.svg";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  Container,
  Avatar,
  Divider,
  CardMedia,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HomeIcon from "@mui/icons-material/Home";
import StorefrontIcon from "@mui/icons-material/Storefront";
import SecurityIcon from "@mui/icons-material/Security";
import ListItemIcon from "@mui/material/ListItemIcon";
import Logout from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../redux/actions/authActions";
import { clearCart } from "../../redux/actions/cartActions";

import "./Header.scss";
// ============================================
const Header = () => {
  const [anchorAvatarEl, setAnchorAvatarEl] = useState(null);
  const [anchormobEl, setAnchormobEl] = useState(null);
  const [menuAvatarOpen, setMenuAvatarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [numberProducts, setNumberProducts] = useState(0);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  // ============================

  // ============================
  const imageUrl = user?.picture
    ? `${process.env.REACT_APP_API_URL}${user.picture}` // Добавляем путь к серверу
    : null;
  // =====================================
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    const handleResize = () => {
      setMenuAvatarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [menuAvatarOpen]);

  // =====================================
  let temp = useSelector((state) => state.cart);

  useEffect(() => {
    setNumberProducts(temp.length);
  }, [temp]);
  // =====================================
  useEffect(() => {
    // if (user) {
    setMenuAvatarOpen(false);
    // }
    if (user && user.name === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);
  // =====================================
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    dispatch(setUser(null, null));
    dispatch(clearCart());
    navigate("/login");
  };
  // ==========================================
  // Открытие меню для профиля
  const handleOpenAvatar = (event) => {
    setAnchorAvatarEl(event.currentTarget);
    setMenuAvatarOpen(true);
  };

  // Закрытие меню
  const handleClose = () => {
    setAnchorAvatarEl(null);
    setMenuAvatarOpen(false);
  };
  // ==================================
  // Открытие меню на мобильных устройствах
  const handleOpenMenu = (event) => {
    setAnchormobEl(event.currentTarget);
    setMenuOpen(true);
  };
  // Закрытие меню
  const handleCloseMenu = () => {
    setAnchormobEl(null);
    setMenuOpen(false);
  };

  // ==================================
  const getActiveLinkStyle = (path) => {
    return location.pathname === path ? { color: "red" } : { color: "" };
  };
  // ==================================

  return (
    <AppBar
      position="fixed"
      sx={{
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: scrollY > 50 ? "#033362D3" : "rgb(3,51,98)",
        transition: "background-color 0.3s ease",
        boxShadow: scrollY > 50 ? "0px 4px 6px rgba(0, 0, 0, 0.1)" : "none",
      }}
      className="header"
    >
      <Container maxWidth="xl">
        <Toolbar className="toolbar">
          {/* Логотип  */}
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
            className="logo"
          >
            <Link to="/">
              <Rt></Rt>
              <No></No>
              <Ex></Ex>
              <Md></Md>
            </Link>
          </Typography>
          {/* Добавляем отображение имени пользователя рядом с иконкой меню на мобильных */}
          <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "left" }}>
            {user ? (
              <>
                <IconButton
                  onClick={handleOpenAvatar}
                  size="small"
                  sx={{ ml: 2 }}
                >
                  <Avatar sx={{ width: 32, height: 32 }}>
                    {user.picture ? (
                      <CardMedia
                        component="img"
                        image={imageUrl}
                        alt="img"
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          m: 2,
                        }}
                      />
                    ) : (
                      <p>A</p>
                    )}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorAvatarEl}
                  id="account-menu"
                  open={menuAvatarOpen}
                  onClose={handleClose}
                  slotProps={{
                    paper: {
                      elevation: 0,
                      sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        "&::before": {
                          content: '""',
                          display: "block",
                          position: "absolute",
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: "background.paper",
                          transform: "translateY(-50%) rotate(45deg)",
                          zIndex: 0,
                        },
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  {user ? (
                    <div>
                      <MenuItem
                        color="inherit"
                        component={Link}
                        to="/profile"
                        onClose={handleClose}
                      >
                        <Avatar />
                        See profile
                      </MenuItem>
                      <Divider />
                      <MenuItem color="inherit" onClick={handleLogout}>
                        <ListItemIcon>
                          <Logout fontSize="small" />
                        </ListItemIcon>
                        Logout
                      </MenuItem>
                    </div>
                  ) : (
                    <div>
                      <MenuItem
                        component={Link}
                        to="/login"
                        onClick={handleCloseMenu}
                        style={getActiveLinkStyle("/")}
                      >
                        <LoginIcon
                          style={{ marginRight: "8px", color: "inherit" }}
                        />
                        Login
                      </MenuItem>
                      <MenuItem
                        component={Link}
                        to="/register"
                        onClick={handleCloseMenu}
                        style={getActiveLinkStyle("/")}
                      >
                        <AppRegistrationIcon
                          style={{ marginRight: "8px", color: "inherit" }}
                        />
                        Registration
                      </MenuItem>
                    </div>
                  )}
                </Menu>
              </>
            ) : (
              <div></div>
            )}
          </Box>{" "}
          {/* Меню для мобильных */}
          {/* Меню для мобильных */}
          {/* Меню для мобильных */}
          {/* Меню для мобильных */}
          {/* Меню для мобильных */}
          {/* Меню для мобильных */}
          {/* Меню для мобильных */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleOpenMenu}
              sx={{ marginLeft: "auto", cursor: "pointer" }}
            >
              <MenuIcon sx={{ marginLeft: "auto", cursor: "pointer" }} />
            </IconButton>
          </Box>
          <Menu
            anchorEl={anchormobEl}
            open={menuOpen}
            onClose={handleCloseMenu}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <MenuItem
              component={Link}
              to="/"
              onClick={handleCloseMenu}
              style={getActiveLinkStyle("/")}
            >
              <HomeIcon style={{ marginRight: "8px", color: "inherit" }} /> Home
            </MenuItem>
            <MenuItem
              component={Link}
              to="/shop"
              onClick={handleCloseMenu}
              style={getActiveLinkStyle("/shop")}
            >
              <StorefrontIcon style={{ marginRight: "8px" }} /> Shop
            </MenuItem>
            <MenuItem
              component={Link}
              to="/contacts"
              onClick={handleCloseMenu}
              style={getActiveLinkStyle("/contacts")}
            >
              <HomeIcon style={{ marginRight: "8px" }} /> Contacts
            </MenuItem>
            {isAdmin && (
              <MenuItem
                component={Link}
                to="/admin"
                onClick={handleCloseMenu}
                style={getActiveLinkStyle("/admin")}
              >
                <SecurityIcon style={{ marginRight: "8px" }} /> Admin
              </MenuItem>
            )}
            <Box
              className="cart-icon"
              component={Link}
              to="/cart"
              onClick={handleCloseMenu}
              style={getActiveLinkStyle("/cart")}
            >
              <ShoppingCartIcon />
              <span className="cart-badge">{numberProducts}</span>
            </Box>
            {!user && (
              <div>
                <MenuItem
                  component={Link}
                  to="/login"
                  onClick={handleCloseMenu}
                  style={getActiveLinkStyle("/login")}
                >
                  <LoginIcon style={{ marginRight: "8px" }} /> Login
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/register"
                  onClick={handleCloseMenu}
                  style={getActiveLinkStyle("/register")}
                >
                  <AppRegistrationIcon style={{ marginRight: "8px" }} />{" "}
                  Registration
                </MenuItem>
              </div>
            )}
          </Menu>
          {/* Меню для больших экранов */}
          {/* Меню для больших экранов */}
          {/* Меню для больших экранов */}
          {/* Меню для больших экранов */}
          {/* Меню для больших экранов */}
          {/* Меню для больших экранов */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              msFlexDirection: "column",
              alignItems: "center",
            }}
          >
            <MenuItem
              component={Link}
              to="/"
              onClick={handleCloseMenu}
              style={getActiveLinkStyle("/")}
            >
              <HomeIcon sx={{ mr: 1 }} /> Home
            </MenuItem>
            <MenuItem
              component={Link}
              to="/shop"
              onClick={handleCloseMenu}
              style={getActiveLinkStyle("/shop")}
            >
              <StorefrontIcon sx={{ mr: 1 }} /> Shop
            </MenuItem>
            <MenuItem
              component={Link}
              to="/contacts"
              onClick={handleCloseMenu}
              style={getActiveLinkStyle("/contacts")}
            >
              <HomeIcon sx={{ mr: 1 }} /> Contacts
            </MenuItem>
            {!user ? (
              <>
                <MenuItem
                  component={Link}
                  to="/login"
                  onClick={handleCloseMenu}
                  style={getActiveLinkStyle("/login")}
                >
                  <LoginIcon sx={{ mr: 1 }} /> Login
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/register"
                  onClick={handleCloseMenu}
                  style={getActiveLinkStyle("/register")}
                >
                  <AppRegistrationIcon sx={{ mr: 1 }} /> Registration
                </MenuItem>
              </>
            ) : (
              <Box
                sx={{
                  // display: { xs: "flex", md: "none", sm: "none" },
                  alignItems: "left",
                }}
              >
                <IconButton
                  onClick={handleOpenAvatar}
                  size="small"
                  sx={{ ml: 1, mr: 1 }}
                >
                  <Avatar sx={{ width: 32, height: 32 }}>
                    {user.picture ? (
                      <CardMedia
                        component="img"
                        image={imageUrl}
                        alt="img"
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          m: 2,
                        }}
                      />
                    ) : (
                      <p>A</p>
                    )}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorAvatarEl}
                  id="account-menu"
                  // open={menuAvatarOpen}
                  // onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <MenuItem
                    color="inherit"
                    component={Link}
                    to="/profile"
                    onClose={handleClose}
                  >
                    <Avatar
                      style={{
                        marginRight: "8px",
                        width: "25px",
                        height: "25px",
                      }}
                    />
                    See profile
                  </MenuItem>
                  <Divider />
                  <MenuItem color="inherit" onClick={handleLogout}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </Box>
            )}

            {/* ----------------------- */}
            <Box className="cart-icon" component={Link} to="/cart">
              <ShoppingCartIcon
                className="cart-icon"
                sx={{
                  mr: 1,
                  color: location.pathname === "/cart" ? "red" : "white",
                  "&:hover": {
                    color: location.pathname !== "/cart" ? "#f0ab30" : "red",
                  },
                }}
              />
              <span className="cart-badge">{numberProducts}</span>
            </Box>
            {isAdmin && (
              <MenuItem
                color="inherit"
                component={Link}
                to="/admin"
                style={getActiveLinkStyle("/admin")}
              >
                <SecurityIcon sx={{ mr: 1 }} /> Admin
              </MenuItem>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
