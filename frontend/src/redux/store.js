import { combineReducers, createStore, applyMiddleware, compose } from "redux";
import productsReducer from "./reducers/productsReducer";
import cartReducer from "./reducers/cartReducer"; // Редьюсер корзины
import authReducer from "./reducers/authReducer";
import categoriesReducer from "./reducers/categoriesReducer";
// =============================================
const localStorageAuthMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState();

  if (state.auth.isAuthenticated) {
    localStorage.setItem("auth", JSON.stringify(state.auth));
  } else {
    localStorage.removeItem("auth");
  }

  return result;
};

// =============================================

// Middleware для сохранения состояния корзины в localStorage
const localStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState();
  localStorage.setItem("cart", JSON.stringify(state.cart));
  return result;
};
// =============================================
// Функция для восстановления состояния корзины из localStorage
const loadCartFromLocalStorage = () => {
  try {
    const serializedCart = localStorage.getItem("cart");
    return serializedCart ? JSON.parse(serializedCart) : [];
  } catch (e) {
    console.error("Ошибка загрузки корзины из localStorage:", e);
    return [];
  }
};
// =============================================
// Создаем rootReducer
const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  auth: authReducer,
  categories: categoriesReducer,
});

// Предварительное состояние, включая корзину из localStorage
const preloadedState = {
  cart: loadCartFromLocalStorage(),
};
// =============================================
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// =============================================

// =============================================
const store = createStore(
  rootReducer,
  preloadedState,

  // applyMiddleware(localStorageMiddleware),
  // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  composeEnhancers(
    applyMiddleware(localStorageAuthMiddleware, localStorageMiddleware)
  )
);
// ----------------------------------------------

export default store;
