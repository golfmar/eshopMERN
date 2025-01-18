export const addToCart = (product) => ({
  type: "ADD_TO_CART",
  payload: product,
});

export const removeFromCart = (productId) => ({
  type: "REMOVE_FROM_CART",
  payload: productId,
});

export const deliteFromCart = (productId) => ({
  type: "DELITE_FROM_CART",
  payload: productId,
});

export const clearCart = () => ({
  type: "CLEAR_CART",
});

export const updateCartItem = (product) => ({
  type: "UPDATE_CART_ITEM",
  payload: product,
});
