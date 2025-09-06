import React, { useContext } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ category }) => {
  const { food_list, url } = useContext(StoreContext);

  if (!Array.isArray(food_list) || food_list.length === 0) {
    return <div>No food items available.</div>;
  }

  return (
    <div className="food-display" id="food-display">
      <h2>Top dishes near you</h2>
      <div className="food-display-list">
        {food_list.map((item) => {
          if (category === "All" || category === item.category) {
            return (
              <FoodItem
                key={item._id}
                id={item._id.toString()}
                name={item.name}
                price={item.price}
                description={item.description}
                image={`${url}/images/${item.image}`}   // ✅ full image URL
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default FoodDisplay;
