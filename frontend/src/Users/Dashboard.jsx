import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("authToken", token);
      navigate("/Userhome"); // or /AdminDashboard depending on role
    }
  }, [navigate]);

  return <h1>Loading...</h1>;
};

export default Dashboard;
