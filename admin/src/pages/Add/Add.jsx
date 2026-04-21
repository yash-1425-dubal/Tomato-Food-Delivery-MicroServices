import React, { useState, useContext, useEffect } from "react";
import "./Add.css";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Add = () => {
  const navigate = useNavigate();
  const { token, admin } = useContext(StoreContext);

  const BASE_URL = import.meta.env.VITE_API_URL;

  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad",
  });

  useEffect(() => {
    if (!admin || !token) navigate("/");
  }, [admin, token]);

  const submit = async (e) => {
    e.preventDefault();

    if (!image) return toast.error("Upload image ❌");

    const formData = new FormData();
    Object.keys(data).forEach((key) =>
      formData.append(key, data[key])
    );
    formData.append("image", image);

    try {
      const res = await axios.post(
        `${BASE_URL}/api/food/add`,
        formData,
        { headers: { token } }
      );

      if (res.data.success) {
        toast.success("Added ✅");
        setData({
          name: "",
          description: "",
          price: "",
          category: "Salad",
        });
        setImage(null);
      }
    } catch {
      toast.error("Error ❌");
    }
  };

  return (
    <form onSubmit={submit} className="add">
      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <input
        name="name"
        value={data.name}
        onChange={(e) =>
          setData({ ...data, name: e.target.value })
        }
        placeholder="Name"
      />

      <textarea
        name="description"
        value={data.description}
        onChange={(e) =>
          setData({ ...data, description: e.target.value })
        }
      />

      <input
        type="number"
        value={data.price}
        onChange={(e) =>
          setData({ ...data, price: e.target.value })
        }
      />

      <button>Add Item</button>
    </form>
  );
};

export default Add;