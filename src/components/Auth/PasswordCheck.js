import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";


const PasswordCheck = ({ children }) => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isFirstStart() === true) {
      navigate('/change-password');
    }
  }, [ navigate]);

  return <>{children}</>;
};

export default PasswordCheck;
