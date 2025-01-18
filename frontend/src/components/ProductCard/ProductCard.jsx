import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useDispatch, useSelector } from "react-redux";
import AddToCart from "../AddToCart/AddToCart";
import RatingComponent from "../Rating/Rating";
import Modal from "../Modal/Modal";
import useProducts from "../../hooks/useProducts";
import useCategories from "../../hooks/useCategories";
import useUpdateCategory from "../../hooks/useUpdateCategory";
import axios from "axios";
import {
  productDelite,
  setProducts,
} from "../../redux/actions/productsActions";
import { deliteFromCart } from "../../redux/actions/cartActions";
import "./ProductCard.scss";
import ModalMessage from "../Modal/ModalMessage";
// ========================================
const ProductCard = ({ pro }) => {
  const { id, onEdit } = pro;
  // const { className } = pro;
  const [className, setClassName] = useState("");
  const [message, setMessage] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openModalCart, setOpenModalCart] = useState(false);
  // ----------------------------
  const dispatch = useDispatch();
  useProducts();
  let products = useSelector((state) => state.products);
  const product = products.find((item) => item._id === id);
  const user = useSelector((state) => state.auth.user);
  // ----------------------------

  // ----------------------------
  const location = useLocation();
  const isCart = location.pathname.includes("/cart");
  const isAdmin = location.pathname.includes("/admin");

  //------------ Categories
  const categories = useCategories();
  const handleCategoryChange = useUpdateCategory(products);
  // ----------------------------
  const handleOpenModal = (productId) => {
    setOpenModal(productId);
  };
  const handleCloseModal = () => {
    setOpenModal(null);
  };
  // -------------------------------
  const handlerProductDelite = async (product) => {
    setMessage("The product was successfully deleted.");
    setOpenModalCart(true);
    await axios.post(
      `${process.env.REACT_APP_API_URL}/products/delite`,
      product
    );
    setTimeout(() => {
      dispatch(productDelite(product._id));
      dispatch(deliteFromCart(product._id));
      setProducts(products.filter((item) => item._id !== product._id));
      setMessage("");
      setOpenModalCart(false);
    }, 1500);
  };

  // -------------------------------
  return (
    <>
      {product && (
        <Card key={product._id} className={`productCard ${className}`}>
          <Link to={`/product/${product._id}`} className="cardLink">
            <CardMedia
              component="img"
              image={product.image}
              alt={product.name}
            />
          </Link>
          <CardContent className="cardContent">
            <Link to={`/product/${product._id}`} className="productName">
              <Typography variant="h5">{product.name}</Typography>
            </Link>
            <Typography variant="p">Price: {product.price} $</Typography>
            <RatingComponent product={product} products={products} />
            {/* description */}
            {isAdmin && (
              <Typography variant="p">
                Description: {product.description}
              </Typography>
            )}
            {/* Category */}
            <Typography variant="p">
              Category:
              <Typography component="span" style={{ marginLeft: "5px" }}>
                {product.category ? product.category.name : "No category"}
              </Typography>
            </Typography>
            {isAdmin && (
              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel>Category change</InputLabel>
                <Select
                  value={product.category ? product.category._id : ""}
                  onChange={(e) =>
                    handleCategoryChange(product._id, e.target.value)
                  }
                  label="Category change"
                >
                  {categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {/* Update */}
            {!isCart && !isAdmin && (
              <div className="icons-block">
                <Modal
                  open={openModal === product._id}
                  product={product}
                  handleCloseModal={handleCloseModal}
                ></Modal>
                <IconButton onClick={() => handleOpenModal(product._id)}>
                  <VisibilityIcon />
                </IconButton>
                {!isCart && !isAdmin && <AddToCart product={product} />}
              </div>
            )}
            {/* Delete */}
            {isAdmin && (
              <div className="icons-block">
                <IconButton onClick={() => onEdit(product)}>
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="secondary"
                  aria-label="delete"
                  onClick={() => handlerProductDelite(product)}
                >
                  <DeleteForeverIcon className="deliteCard" />
                </IconButton>
              </div>
            )}
          </CardContent>
          {message !== "" && (
            <ModalMessage open={openModalCart} message={message}></ModalMessage>
          )}
        </Card>
      )}
    </>
  );
};

export default ProductCard;
