import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <NavLink to="/add">Add</NavLink>
      <NavLink to="/list">List</NavLink>
      <NavLink to="/orders">Orders</NavLink>
    </div>
  );
};

export default Sidebar;