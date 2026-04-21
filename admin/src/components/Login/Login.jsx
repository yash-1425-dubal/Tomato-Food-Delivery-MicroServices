import React, { useContext, useEffect, useState } from "react";
import "./Login.css";
import { toast } from "react-toastify";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const { admin, setAdmin, token, setToken } =
    useContext(StoreContext);

  // ✅ ENV BASE URL
  const BASE_URL = import.meta.env.VITE_API_URL;

  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();

    if (!data.email || !data.password) {
      return toast.error("All fields required ❌");
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${BASE_URL}/api/user/login`,
        data
      );

      if (response.data.success) {
        if (response.data.role === "admin") {
          setToken(response.data.token);
          setAdmin(true);

          localStorage.setItem("token", response.data.token);
          localStorage.setItem("admin", "true");

          toast.success("Admin Login Successful ✅");
          navigate("/add");
        } else {
          toast.error("Access denied (Not Admin) ❌");
        }
      } else {
        toast.error(response.data.message);
      }

    } catch (error) {
      console.error(error);
      toast.error("Server or network error ❌");
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // AUTO LOGIN (PERSIST)
  // ==========================
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const isAdmin = localStorage.getItem("admin");

    if (savedToken && isAdmin === "true") {
      setToken(savedToken);
      setAdmin(true);
      navigate("/add");
    }
  }, []);

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">

        <div className="login-popup-title">
          <h2>Admin Login</h2>
        </div>

        <div className="login-popup-inputs">

          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Admin email"
            required
          />

          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder="Password"
            required
          />

        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>
    </div>
  );
};

export default Login;