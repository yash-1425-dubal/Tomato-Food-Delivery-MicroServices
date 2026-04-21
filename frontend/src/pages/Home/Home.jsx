import React, { useState, useEffect } from "react";
import "./Home.css";
import Header from "../../components/Header/Header";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import AppDownload from "../../components/AppDownload/AppDownload";

const Home = () => {
  const [category, setCategory] = useState("All");

  // ✅ Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="home">
      {/* Header */}
      <Header />

      {/* Category Menu */}
      <ExploreMenu category={category} setCategory={setCategory} />

      {/* Food List */}
      <FoodDisplay category={category} />

      {/* App Download */}
      <AppDownload />
    </div>
  );
};

export default Home;