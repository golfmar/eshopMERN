import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setProducts } from "../redux/actions/productsActions";

const useProducts = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const filters = {};
        await axios
          .get(`${process.env.REACT_APP_API_URL}/products`, { params: filters })
          .then((response) => {
            const productsWithCategoryNames = response.data.map((product) => ({
              ...product,
              categoryName: product.category
                ? product.category.name
                : "No Category",
            }));
            dispatch(setProducts(productsWithCategoryNames));
          });
      } catch (error) {
        console.error("error:", error);
      }
    };

    fetchProducts();
  }, [dispatch]);
};

export default useProducts;
