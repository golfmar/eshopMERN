import React from "react";
import { Typography, Button } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "./Popular.scss";
import { useSelector } from "react-redux";
import useProducts from "../../hooks/useProducts";
import "swiper/css/navigation";
import "swiper/scss/navigation";
import ProductCard from "../ProductCard/ProductCard";
// ===================================

function Popular() {
  useProducts();
  let products = useSelector((state) => state.products);
  const filteredProducts = products.filter((product) => product.rating >= 4);

  return (
    <div className="popular">
      <Typography variant="h3" gutterBottom>
        Most popular products
      </Typography>
      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={1}
        loop
        navigation={{
          prevEl: ".swiper-button-prev",
          nextEl: ".swiper-button-next",
        }}
        breakpoints={{
          1500: {
            slidesPerView: 3,
          },
          970: {
            slidesPerView: 2,
          },
        }}
      >
        {filteredProducts.map((product) => (
          <SwiperSlide key={product._id}>
            <ProductCard pro={{ id: product._id }} className="popularcard" />
          </SwiperSlide>
        ))}
      </Swiper>
      <Button className="swiper-button-prev"></Button>
      <Button className="swiper-button-next"></Button>
    </div>
  );
}

export default Popular;
