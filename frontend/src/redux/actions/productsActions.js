export const SET_PRODUCTS = "SET_PRODUCTS";
export const ADD_PRODUCT = "ADD_PRODUCT";
export const PRODUCT_DELITE = "PRODUCT_DELITE";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";

// Действие для установки продуктов
export const setProducts = (products) => {
  return {
    type: SET_PRODUCTS,
    payload: products,
  };
};

// Действие для добавления продукта
export const addProduct = (product) => {
  return {
    type: ADD_PRODUCT,
    payload: product,
  };
};
export const productDelite = (product) => ({
  type: "PRODUCT_DELITE",
  payload: product,
});

// // Действие для удаления продукта
// export const removeProduct = (productId) => {
//   return {
//     type: REMOVE_PRODUCT,
//     payload: productId,
//   };
// };

// Действие для обновления продукта
export const updateProduct = (product) => {
  return {
    type: UPDATE_PRODUCT,
    payload: product,
  };
};
