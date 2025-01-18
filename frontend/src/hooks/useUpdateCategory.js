import { useDispatch } from "react-redux";
import axios from "axios";
import { setProducts } from "../redux/actions/productsActions";
import { updateCartItem } from "../redux/actions/cartActions";
const useUpdateProductCategory = (products) => {
  const dispatch = useDispatch();

  const handleCategoryChange = (productId, newCategoryId) => {
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/products/${productId}/updateCategory`,
        {
          category: newCategoryId,
        }
      )
      .then((response) => {
        dispatch(
          setProducts(
            products.map((product) =>
              product._id === productId
                ? { ...product, category: response.data.category }
                : product
            )
          )
        );
        products.map((product) =>
          product._id === productId
            ? { ...product, category: response.data.category }
            : product
        );
        const product = products.find((p) => p._id === productId);
        dispatch(
          updateCartItem({ ...product, category: response.data.category })
        );
      })
      .catch((error) => {
        console.error("Error updating category:", error);
      });
  };

  return handleCategoryChange;
};

export default useUpdateProductCategory;
