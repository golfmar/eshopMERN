const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
      };
    case "LOGOUT_USER":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
      };
    case "RESTORE_AUTH":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: action.payload.isAuthenticated,
      };
    default:
      return state;
  }
};

export default authReducer;
