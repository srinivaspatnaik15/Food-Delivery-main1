import React, { useContext } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/frontend_assets/assets";
import { StoreContext } from "../../context/StoreContext";

// Fallbacks
const FALLBACK_NAME = "Unknown Dish";
const FALLBACK_DESC = "No description available.";
const FALLBACK_PRICE = "N/A";

const FoodItem = ({ id, name, price, description }) => {
  const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);

  // Defensive checks for props
  const itemId = id || "unknown_id";
  const itemName = name || FALLBACK_NAME;
  const itemDesc = description || FALLBACK_DESC;
  const itemPrice = price !== undefined && price !== null ? price : FALLBACK_PRICE;

  // Handle missing cartItems gracefully
  const cartCount = cartItems && cartItems[itemId] ? cartItems[itemId] : 0;

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        {/* Removed the main dish image completely */}

        {cartCount === 0 ? (
          <img
            className="add"
            onClick={() => addToCart && addToCart(itemId)}
            src={assets.add_icon_white}
            alt="Add"
          />
        ) : (
          <div className="food-item-counter">
            <img
              onClick={() => removeFromCart && removeFromCart(itemId)}
              src={assets.remove_icon_red}
              alt="Remove"
            />
            <p>{cartCount}</p>
            <img
              onClick={() => addToCart && addToCart(itemId)}
              src={assets.add_icon_green}
              alt="Add"
            />
          </div>
        )}
      </div>

      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{itemName}</p>
          <img src={assets.rating_starts} alt="Rating" />
        </div>
        <p className="food-item-desc">{itemDesc}</p>
        <p className="food-item-price">₹{itemPrice}</p>
      </div>
    </div>
  );
};

export default FoodItem;
