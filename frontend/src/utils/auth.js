// src/utils/auth.js

export const setAuth = (username, password, role) => {
  localStorage.setItem("username", username);
  localStorage.setItem("password", password);
  if (role) {
    localStorage.setItem("role", role);
  }
};

export const clearAuth = () => {
  localStorage.removeItem("username");
  localStorage.removeItem("password");
  localStorage.removeItem("role");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("username") && !!localStorage.getItem("password");
};


export const getAuthHeader = () => {
  const username = localStorage.getItem("username");
  const password = localStorage.getItem("password");
  return "Basic " + btoa(`${username}:${password}`);
};

export const getRole = () => {
  return localStorage.getItem("role");
};