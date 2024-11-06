import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Logout() {
  const navigate = useNavigate();
  const authContext = useAuth();

  useEffect(() => {
    authContext.logout()
    navigate("/login", { replace: true });
  }, [navigate]);

  return null;
}

export default Logout;
