// src/actions/authActions.js

export const setUser = (user, token) => ({
  type: "SET_USER",
  payload: { user, token },
});

export const logoutUser = () => ({
  type: "LOGOUT_USER",
});

export const restoreAuth = () => {
  const authData = JSON.parse(localStorage.getItem("auth"));
  if (authData) {
    return {
      type: "RESTORE_AUTH",
      payload: {
        user: authData.user,
        token: authData.token,
        isAuthenticated: authData.isAuthenticated,
      },
    };
  }
  return { type: "LOGOUT_USER" };
};
