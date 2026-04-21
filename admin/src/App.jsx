import React, { useContext } from "react";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { Route, Routes, Navigate } from "react-router-dom";
import Add from "./pages/Add/Add";
import List from "./pages/List/List";
import Orders from "./pages/Orders/Orders";
import Login from "./components/Login/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { StoreContext } from "./context/StoreContext";

// ==========================
// PROTECTED ROUTE
// ==========================
const ProtectedRoute = ({ children }) => {
  const { token, admin } = useContext(StoreContext);

  if (!token || !admin) {
    return <Navigate to="/" />;
  }

  return children;
};

const App = () => {
  return (
    <div>
      <ToastContainer />

      <Routes>

        {/* LOGIN */}
        <Route path="/" element={<Login />} />

        {/* PROTECTED ADMIN ROUTES */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <hr />
                <div className="app-content">
                  <Sidebar />
                  <Routes>
                    <Route path="/add" element={<Add />} />
                    <Route path="/list" element={<List />} />
                    <Route path="/orders" element={<Orders />} />
                  </Routes>
                </div>
              </>
            </ProtectedRoute>
          }
        />

      </Routes>
    </div>
  );
};

export default App;