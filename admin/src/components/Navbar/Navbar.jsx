import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Navbar = () => {
  const { token, admin, setToken, setAdmin } =
    useContext(StoreContext);

  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    setToken("");
    setAdmin(false);
    toast.success("Logged out");
    navigate("/");
  };

  return (
    <div className="navbar">
      <h2>Admin Panel</h2>

      {token && admin ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button onClick={() => navigate("/")}>Login</button>
      )}
    </div>
  );
};

export default Navbar;