
export const isLoggedIn = () => {
  return localStorage.getItem("username") && localStorage.getItem("password");
};

export const logout = () => {
  localStorage.removeItem("username");
  localStorage.removeItem("password");
};

export const getAuthHeader = () => {
  const username = localStorage.getItem("username");
  const password = localStorage.getItem("password");
  if (!username || !password) return {};
  const token = btoa(`${username}:${password}`);
  return {
    Authorization: `Basic ${token}`,
  };
};
