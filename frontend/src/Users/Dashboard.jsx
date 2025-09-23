import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading } = useContext(AuthContext);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login"); // not logged in
      } else if (user.type === "admin") {
        navigate("/AdminDashboard");
      } else {
        navigate("/Userhome");
      }
    }
  }, [user, loading, navigate]);

  return <h1>Loading...</h1>;
};

export default Dashboard;
