import React, { useState, useEffect } from "react";
import {
  Slider,
  TextField,
  Typography,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import useCategories from "../../hooks/useCategories";

const Filter = ({ handleFilteredProducts }) => {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const categories = useCategories();
  const products = useSelector((state) => state.products);

  // --------------------
  const handlePriceChange = (event, position) => {
    let value = Number(event.target.value);
    if (isNaN(value) || value < 0) value = 0;
    if (position === "min") {
      if (value > priceRange[1]) value = priceRange[1];
      setPriceRange([value, priceRange[1]]);
    } else if (position === "max") {
      if (value < priceRange[0]) value = priceRange[0];
      setPriceRange([priceRange[0], value]);
    }
  };

  useEffect(() => {
    if (priceRange[0] > priceRange[1]) {
      setPriceRange([priceRange[1], priceRange[0]]);
    }
  }, [priceRange]);

  // --------------------
  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prevSelectedCategories) => {
      if (prevSelectedCategories.includes(categoryId)) {
        return prevSelectedCategories.filter((id) => id !== categoryId);
      } else {
        return [...prevSelectedCategories, categoryId];
      }
    });
  };

  // --------------------
  const applyFilters = () => {
    let filtered = [...products];

    // -----------------Фильтрация по цене
    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    //--------------- Фильтрация по категориям
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategories.includes(product.category._id)
      );
    }

    // ------------------Передаем отфильтрованные продукты в родительский компонент
    handleFilteredProducts(filtered);
  };

  return (
    <div className="filterContainer">
      <Typography gutterBottom>Price Range</Typography>
      <Slider
        value={priceRange}
        onChange={(_, newValue) => setPriceRange(newValue)}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => `${value} $.`}
        min={0}
        max={1000}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
        }}
      >
        <TextField
          label="Min Price"
          variant="outlined"
          type="number"
          value={priceRange[0]}
          onChange={(e) => handlePriceChange(e, "min")}
          style={{ width: "48%" }}
          inputProps={{ min: 0 }}
        />
        <TextField
          label="Max Price"
          variant="outlined"
          type="number"
          value={priceRange[1]}
          onChange={(e) => handlePriceChange(e, "max")}
          style={{ width: "48%" }}
          inputProps={{ min: 0 }}
        />
      </div>
      <div style={{ marginTop: "20px" }}>
        <Typography gutterBottom>Categories</Typography>
        <div>
          {categories.map((category) => (
            <FormControlLabel
              key={category._id}
              control={
                <Checkbox
                  checked={selectedCategories.includes(category._id)}
                  onChange={() => handleCategoryChange(category._id)}
                  name={category.name}
                />
              }
              label={category.name}
            />
          ))}
        </div>
      </div>
      <Button
        variant="contained"
        color="primary"
        onClick={applyFilters}
        style={{ marginTop: "20px" }}
      >
        Apply Filters
      </Button>
    </div>
  );
};

export default Filter;
