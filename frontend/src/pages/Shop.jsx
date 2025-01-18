import React from "react";
import { Typography } from "@mui/material";
import ProductList from "../components/ProductList/ProductList";
import Popular from "../components/Popular/Popular";
const Shop = () => {
  return (
    <div className="pageContent">
      <Typography variant="h3" gutterBottom>
        Our products
      </Typography>
      <ProductList />
      <Popular />
    </div>
  );
};

export default Shop;
