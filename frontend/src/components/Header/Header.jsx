import React from "react";
import "./Header.css";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ==========================
  // HANDLE VIEW MENU CLICK
  // ==========================
  const handleViewMenu = () => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById("explore-menu")?.scrollIntoView({
          behavior: "smooth",
        });
      }, 300);
    } else {
      document.getElementById("explore-menu")?.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="header">
      <div className="header-contents">

        <h2>Order your favourite food here</h2>

        <p>
          Choose from a diverse menu featuring a delightful array of dishes
          crafted with the finest ingredients and culinary expertise. Our
          mission is to satisfy your cravings and elevate your dining
          experience, one delicious meal at a time.
        </p>

        <button onClick={handleViewMenu}>
          View Menu
        </button>

      </div>
    </div>
  );
};

export default Header;