import React, { useContext } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ category }) => {
  const { food_list, loading } = useContext(StoreContext);

  // ==========================
  // FILTER ITEMS
  // ==========================
  const filteredItems = food_list?.filter(
    (item) => category === "All" || category === item.category
  );

  return (
    <div className="food-display" id="food-display">

      <h2>Top dishes near you</h2>

      {/* LOADING */}
      {loading ? (
        <p style={{ textAlign: "center" }}>Loading food items...</p>
      ) : filteredItems.length === 0 ? (
        <p style={{ textAlign: "center" }}>No items found 🍽️</p>
      ) : (
        <div className="food-display-list">
          {filteredItems.map((item) => (
            <FoodItem
              key={item._id} // ✅ FIXED
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FoodDisplay;