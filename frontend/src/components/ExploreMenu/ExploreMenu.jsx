import React from "react";
import "./ExploreMenu.css";
import { menu_list } from "../../assets/frontend_assets/assets";

const ExploreMenu = ({ category, setCategory }) => {

  // ==========================
  // HANDLE CATEGORY CLICK
  // ==========================
  const handleClick = (name) => {
    setCategory((prev) => (prev === name ? "All" : name));
  };

  return (
    <div className="explore-menu" id="explore-menu">

      <h1>Explore our menu</h1>

      <p className="explore-menu-text">
        Choose from a diverse menu featuring a delightful array of dishes.
        Our mission is to satisfy your cravings and elevate your dining
        experience, one delicious meal at a time.
      </p>

      <div className="explore-menu-list">
        {menu_list.map((item) => (
          <div
            key={item.menu_name} // ✅ FIXED
            onClick={() => handleClick(item.menu_name)}
            className="explore-menu-list-item"
          >
            <img
              className={category === item.menu_name ? "active" : ""}
              src={item.menu_image}
              alt={item.menu_name}
            />
            <p>{item.menu_name}</p>
          </div>
        ))}
      </div>

      <hr />
    </div>
  );
};

export default ExploreMenu;