import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ ENV BASE URL (VERY IMPORTANT)
  const BASE_URL = import.meta.env.VITE_API_URL;

  // ✅ Axios instance
  const api = axios.create({
    baseURL: BASE_URL,
  });

  // ==============================
  // ADD TO CART
  // ==============================
  const addToCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));

    if (token) {
      try {
        const res = await api.post(
          "/api/cart/add",
          { itemId },
          { headers: { token } }
        );

        if (!res.data.success) {
          toast.error("Failed to add item ❌");
        }
      } catch (err) {
        console.error(err);
        toast.error("Server error ❌");
      }
    }
  };

  // ==============================
  // REMOVE FROM CART
  // ==============================
  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      if (updated[itemId] > 1) {
        updated[itemId] -= 1;
      } else {
        delete updated[itemId];
      }
      return updated;
    });

    if (token) {
      try {
        const res = await api.post(
          "/api/cart/remove",
          { itemId },
          { headers: { token } }
        );

        if (!res.data.success) {
          toast.error("Failed to remove item ❌");
        }
      } catch (err) {
        console.error(err);
        toast.error("Server error ❌");
      }
    }
  };

  // ==============================
  // TOTAL AMOUNT
  // ==============================
  const getTotalCartAmount = () => {
    return Object.keys(cartItems).reduce((total, id) => {
      const item = food_list.find((f) => f._id === id);
      return item ? total + item.price * cartItems[id] : total;
    }, 0);
  };

  // ==============================
  // FETCH FOOD LIST
  // ==============================
  const fetchFoodList = async () => {
    try {
      setLoading(true);

      const res = await api.get("/api/food/list");

      if (res.data.success) {
        setFoodList(res.data.data);
      } else {
        toast.error("Failed to load food ❌");
      }

    } catch (err) {
      console.error(err);
      toast.error("Server error ❌");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // LOAD CART DATA
  // ==============================
  const loadCartData = async (token) => {
    try {
      const res = await api.post(
        "/api/cart/get",
        {},
        { headers: { token } }
      );

      setCartItems(res.data.cartData || {});
    } catch (err) {
      console.error(err);
    }
  };

  // ==============================
  // INIT
  // ==============================
  useEffect(() => {
    const init = async () => {
      await fetchFoodList();

      const savedToken = localStorage.getItem("token");

      if (savedToken) {
        setToken(savedToken);
        await loadCartData(savedToken);
      }
    };

    init();
  }, []);

  // ==============================
  // SAVE TOKEN
  // ==============================
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    }
  }, [token]);

  // ==============================
  // CONTEXT
  // ==============================
  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    token,
    setToken,
    url: BASE_URL, // ✅ IMPORTANT for images
    loading,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;