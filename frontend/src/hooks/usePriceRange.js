import { useState } from "react";

const usePriceRange = () => {
  const [priceRange, setPriceRange] = useState([0, 1000]);

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

  return { priceRange, setPriceRange, handlePriceChange };
};

export default usePriceRange;
