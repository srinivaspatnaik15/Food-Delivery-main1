import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [food_list, setFoodList] = useState([]);
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);

  const url = import.meta.env.VITE_API_URL; // backend URL from .env

  // ✅ Add to cart
  const addToCart = async (itemId) => {
    try {
      if (!token) {
        toast.error("Please login first");
        return;
      }

      const response = await axios.post(
        `${url}/api/cart/add`,
        { itemId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setCartItems(response.data.cartData); // sync with backend
        toast.success("Item added to cart");
      } else {
        toast.error(response.data.message || "Failed to add item");
      }
    } catch (err) {
      console.error("Add to cart failed:", err);
      toast.error("Something went wrong");
    }
  };

  // ✅ Remove from cart
  const removeFromCart = async (itemId) => {
    try {
      if (!token) {
        toast.error("Please login first");
        return;
      }

      const response = await axios.post(
        `${url}/api/cart/remove`,
        { itemId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setCartItems(response.data.cartData); // sync with backend
        toast.success("Item removed from cart");
      } else {
        toast.error(response.data.message || "Failed to remove item");
      }
    } catch (err) {
      console.error("Remove from cart failed:", err);
      toast.error("Something went wrong");
    }
  };

  // ✅ Get total amount
const getTotalCartAmount = () => {
  let totalAmount = 0;
  for (const item in cartItems) {
    if (cartItems[item] > 0) {
      let itemInfo = food_list.find(
        (product) => product._id.toString() === item.toString()
      );
      if (itemInfo) {
        totalAmount += itemInfo.price * cartItems[item];
      }
    }
  }
  return totalAmount;
};


  // ✅ Fetch food list
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setFoodList(response.data.data);
      } else {
        toast.error("Error fetching products");
      }
    } catch (err) {
      console.error("Food list fetch failed:", err);
      toast.error("Network error fetching products");
    }
  };

  // ✅ Load cart data from backend
  const loadCartData = async (token) => {
    try {
      const response = await axios.post(
        `${url}/api/cart/get`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setCartItems(response.data.cartData || {});
      } else {
        setCartItems({});
      }
    } catch (err) {
      console.error("Cart fetch failed:", err);
      setCartItems({});
    }
  };

  // ✅ On mount → load food + cart if logged in
  useEffect(() => {
    async function loadData() {
      await fetchFoodList();

      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        try {
          const decoded = jwtDecode(savedToken);
          setUser({ _id: decoded.id || decoded._id });
        } catch (err) {
          console.error("Invalid token:", err);
        }
        await loadCartData(savedToken);
      }
    }
    loadData();
  }, []);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    user,
    setUser,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
