import React, { useContext, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const PlaceOrder = () => {
  const { cartItems, setCartItems, food_list, getTotalCartAmount, url, token, user } =
    useContext(StoreContext);

  const [data, setData] = useState(""); // address data, update as needed
  const navigate = useNavigate();

  const placeOrder = async (event) => {
    event.preventDefault();

    let orderItems = Object.keys(cartItems)
      .filter((id) => cartItems[id] > 0)
      .map((id) => {
        const item = food_list.find((food) => food._id === id);
        return {
          _id: id,
          name: item?.name,
          price: item?.price,
          quantity: cartItems[id],
        };
      });

    if (orderItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    let orderData = {
      userId: user?._id || undefined,
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
      paymentMethod: "COD",
    };

    try {
      const response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        // ✅ Clear cart on success
        setCartItems({});
        toast.success("🎉 Order placed successfully");
        navigate("/myorders");
      } else {
        toast.error("Order failed");
      }
    } catch (error) {
      console.error("❌ Backend save failed:", error);
      toast.error("Something went wrong while placing order");
    }
  };

  return (
    <div>
      <h1>Place Your Order</h1>
      <form onSubmit={placeOrder}>
        <input
          type="text"
          placeholder="Enter delivery address"
          value={data}
          onChange={(e) => setData(e.target.value)}
          required
        />
        <button type="submit">Confirm Order</button>
      </form>
    </div>
  );
};

export default PlaceOrder;
