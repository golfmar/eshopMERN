const initialState = [];

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existingItem = state.find(
        (item) => item._id === action.payload._id
      );
      if (existingItem) {
        return state.map((item) =>
          item._id === action.payload._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];
    }
    case "REMOVE_FROM_CART": {
      return state
        .map((item) =>
          item._id === action.payload
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0);
    }
    case "DELITE_FROM_CART": {
      return state.filter((item) => item._id !== action.payload);
    }
    case "UPDATE_CART_ITEM": {
      return state.map((item) =>
        item._id === action.payload._id ? { ...item, ...action.payload } : item
      );
    }
    case "CLEAR_CART":
      return [];
    default:
      return state;
  }
};

export default cartReducer;
