import { useNavigate } from "react-router-dom";

function Dashboard() {
  const nav = useNavigate();

  return (
    <div className="container">
      <h1>Dashboard</h1>
      <p>Welcome to your FoodCycle dashboard. What would you like to do?</p>
      <button onClick={() => nav("/donate")}>Donate Food</button>
      <button onClick={() => nav("/buy")}>Buy Food</button>
      <button onClick={() => nav("/sell")}>Sell Food</button>
    </div>
  );
}

export default Dashboard;