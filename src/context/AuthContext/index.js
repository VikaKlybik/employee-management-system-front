import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";
import BasicLayout from "../../layouts/authentication/components/BasicLayout";

const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUser({ ...decodedToken, token });
    }
  }, []);

  const login = (token) => {
    const decodedToken = jwtDecode(token);
    localStorage.setItem("token", token);
    setUser({ ...decodedToken, token });
  };

  const getUser = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      return { ...decodedToken, token };
    }
    return null;
  }
  const isFirstStart = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      return { ...decodedToken, token }.isFirstStart;
    }
    return null;
  }

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, isFirstStart, login, logout, getUser }}>{children}</AuthContext.Provider>;
};

BasicLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
