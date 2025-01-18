import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import useProducts from "../../hooks/useProducts";
import AddToCart from "../../components/AddToCart/AddToCart";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import "./ProductDetails.scss";
import RatingComponent from "../../components/Rating/Rating";
// ===================================
const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  useProducts();
  const products = useSelector((state) => state.products);
  const product = products.find((item) => item._id === id);

  if (!product) {
    return <Typography variant="h6">The product was not found.</Typography>;
  }
  const currentIndex = products.findIndex((item) => item._id === id);
  const prevProduct = products[currentIndex - 1];
  const nextProduct = products[currentIndex + 1];
  const goToPrevious = () => {
    if (prevProduct) {
      navigate(`/product/${prevProduct._id}`);
    }
  };

  const goToNext = () => {
    if (nextProduct) {
      navigate(`/product/${nextProduct._id}`);
    }
  };

  return (
    <Box className="pageContent productDetails">
      <Box className="productDetails__header">
        <IconButton onClick={goToPrevious} disabled={!prevProduct}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h3">{product.name}</Typography>
        <IconButton onClick={goToNext} disabled={!nextProduct}>
          <ArrowForwardIcon />
        </IconButton>
      </Box>

      <CardContent className="productDetails__content">
        <CardMedia component="img" image={product.image} alt={product.name} />
        <div className="productDetails__info">
          <Typography variant="body1">Price: {product.price} $.</Typography>
          <RatingComponent product={product} products={products} />
          <Typography variant="body2">{product.description}</Typography>
          <AddToCart product={product} />
        </div>
      </CardContent>
    </Box>
  );
};

export default ProductDetails;
