// src/utils/auth.js

export const setAuth = (username, password) => {
  localStorage.setItem("username", username);
  localStorage.setItem("password", password);
};

export const clearAuth = () => {
  localStorage.removeItem("username");
  localStorage.removeItem("password");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("username") && !!localStorage.getItem("password");
};

export const getAuthHeader = () => {
  const username = localStorage.getItem("username");
  const password = localStorage.getItem("password");
  return "Basic " + btoa(`${username}:${password}`);
};
