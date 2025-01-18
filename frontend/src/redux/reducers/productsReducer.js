// const initialState = [];

// const productsReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case "SET_PRODUCTS":
//       return action.payload;
//     case "PRODUCT_DELITE":
//       return state.filter((product) => product._id !== action.payload._id);
//     default:
//       return state;
//   }
// };

// export default productsReducer;

import {
  SET_PRODUCTS,
  ADD_PRODUCT,
  PRODUCT_DELITE,
  UPDATE_PRODUCT,
} from "../actions/productsActions";

const initialState = [];

// Редьюсер для работы с продуктами
const productsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PRODUCTS:
      return [...action.payload]; // Устанавливаем все продукты в Redux
    case ADD_PRODUCT:
      return [...state, action.payload]; // Добавляем новый продукт
    case PRODUCT_DELITE:
      return state.filter((product) => product._id !== action.payload); // Удаляем продукт по id
    case UPDATE_PRODUCT:
      return state.map((product) =>
        product._id === action.payload._id
          ? { ...product, ...action.payload }
          : product
      ); // Обновляем продукт по id
    default:
      return state;
  }
};

export default productsReducer;
