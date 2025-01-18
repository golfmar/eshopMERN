import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Rating,
} from "@mui/material";
import AddToCart from "../src/components/AddToCart/AddToCart";
import { Link, useLocation } from "react-router-dom";

// -------------------------------------------
const ProductCard = ({ product, handleRatingChange }) => {
  const location = useLocation();
  const isCart = location.pathname.includes("/cart");
  const isAdmin = location.pathname.includes("/admin");
  return (
    <Card key={product._id} className="productCard">
      <CardMedia
        component="img"
        height="140"
        image={product.image}
        alt={product.name}
      />
      <CardContent className="cardContent">
        <Typography variant="h4">{product.name}</Typography>
        <Typography variant="p">Price: {product.price} $</Typography>
        <Typography variant="p">
          Category: {product.category ? product.category.name : "No category"}
        </Typography>
        {/*  рейтинг  */}
        <Rating
          onChange={(e, newValue) => handleRatingChange(e, newValue, product)}
          value={product.rating || 0} // Используем текущий рейтинг
          precision={0.5}
        />
        <Typography variant="p">Average rating</Typography>
        <span>{product.rating || 0} / 5</span>
        {/* Добавляем селект для изменения категории */}
        {isAdmin && (
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              value={product.category ? product.category._id : ""}
              onChange={(e) =>
                handleCategoryChange(product._id, e.target.value)
              }
              label="Category"
            >
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <Link to={`/product/${product._id}`} className="cardLink">
          <Button variant="outlined" color="primary">
            Learn more
          </Button>
        </Link>
        {!isCart && !isAdmin && <AddToCart product={product} />}
        {isAdmin && (
          <Button
            variant="outlined"
            color="primary"
            className="deliteCard"
            onClick={() => handlerProductDelite(product)}
          >
            Delite
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;
