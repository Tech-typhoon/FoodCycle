import { useEffect, useState } from "react";
import axios from "axios";

function Buy() {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/foods")
      .then(res => setFoods(res.data))
      .catch(err => alert("Error loading foods: " + err.message));
  }, []);

  return (
    <div className="container">
      <h2>Available Foods</h2>
      {foods.length === 0 ? (
        <p>No foods available at the moment.</p>
      ) : (
        foods.map((food) => (
          <div key={food._id} className="food-item">
            <img src={food.image} alt={food.name} />
            <div>
              <h3>{food.name}</h3>
              {food.type === "sell" && (
                <>
                  <p>Price: ${food.price}</p>
                  <p>Quantity: {food.quantity}</p>
                  <p>Expiry: {food.expiry}</p>
                </>
              )}
              {food.type === "donate" && <p>Donated Food</p>}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Buy;